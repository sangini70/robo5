import fs from 'fs';
import path from 'path';
import { createSign } from 'crypto';
import firebaseConfig from '../firebase-applet-config.json';

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { timestampValue: string }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { arrayValue: { values: FirestoreValue[] } };

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

type FirestoreAdminConfig = {
  projectId: string;
  databaseId: string;
  clientEmail: string;
  privateKey: string;
};

const FIRESTORE_SCOPE = 'https://www.googleapis.com/auth/datastore';
const FIRESTORE_BASE_URL = 'https://firestore.googleapis.com/v1';
const APPLY_MODE = process.argv.includes('--apply');

const CATEGORY_SLUG_MAP: Record<string, string> = {
  환율: '환율',
  ETF: 'ETF',
  '경제 기초': '경제 기초',
  '경제기초': '경제 기초',
  '미국 증시': '미국증시',
  미국증시: '미국증시',
  세금: '세금/지원금',
  '세금/지원금': '세금/지원금',
};

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (!key || process.env[key] !== undefined) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvLocal();

function getFirestoreAdminConfig(): FirestoreAdminConfig {
  const projectId = firebaseConfig.projectId || process.env.FIREBASE_PROJECT_ID;
  const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is required for Firestore admin access.');
  }
  if (!clientEmail) {
    throw new Error('FIREBASE_CLIENT_EMAIL is required for Firestore admin access.');
  }
  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY is required for Firestore admin access.');
  }

  return {
    projectId,
    databaseId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function normalizeTimestampInput(value: any): string | null {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (typeof value?.toDate === 'function') {
    const parsed = value.toDate();
    return parsed instanceof Date && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : null;
  }

  return null;
}

function toFirestoreValue(value: any, fieldPath = ''): FirestoreValue | undefined {
  if (value === undefined) return undefined;

  const fieldName = fieldPath.split('.').pop() || fieldPath;
  const shouldConvertToTimestamp = ['createdAt', 'updatedAt', 'publishDate', 'changedAt'].includes(fieldName);

  if (shouldConvertToTimestamp) {
    const timestampValue = normalizeTimestampInput(value);
    if (timestampValue) {
      return { timestampValue };
    }
    if (value === null) {
      return { nullValue: null };
    }
    return undefined;
  }

  if (value === null) return { nullValue: null };

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value
          .map((item, index) => toFirestoreValue(item, `${fieldPath}.${index}`))
          .filter((item): item is FirestoreValue => Boolean(item)),
      },
    };
  }

  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }

  switch (typeof value) {
    case 'string':
      return { stringValue: value };
    case 'number':
      return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
    case 'boolean':
      return { booleanValue: value };
    case 'object': {
      const fields: Record<string, FirestoreValue> = {};
      for (const [key, nestedValue] of Object.entries(value)) {
        const encoded = toFirestoreValue(nestedValue, fieldPath ? `${fieldPath}.${key}` : key);
        if (encoded !== undefined) {
          fields[key] = encoded;
        }
      }
      return { mapValue: { fields } };
    }
    default:
      return { stringValue: String(value) };
  }
}

function encodeFirestoreFields(data: Record<string, any>) {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(data)) {
    const encoded = toFirestoreValue(value, key);
    if (encoded !== undefined) {
      fields[key] = encoded;
    }
  }
  return fields;
}

function fromFirestoreValue(value: FirestoreValue): any {
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;

  if ('arrayValue' in value) {
    return (value.arrayValue.values || []).map((item) => fromFirestoreValue(item));
  }

  if ('mapValue' in value) {
    const result: Record<string, any> = {};
    const fields = value.mapValue.fields || {};
    for (const [key, nestedValue] of Object.entries(fields)) {
      result[key] = fromFirestoreValue(nestedValue);
    }
    return result;
  }

  return null;
}

function fromFirestoreDocument(document: FirestoreDocument) {
  const data: Record<string, any> = {};
  const fields = document.fields || {};

  for (const [key, value] of Object.entries(fields)) {
    data[key] = fromFirestoreValue(value);
  }

  if (!data.id && document.name) {
    data.id = document.name.split('/').pop() || data.id;
  }

  return data;
}

function getCollectionPath() {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  return `${FIRESTORE_BASE_URL}/projects/${projectId}/databases/${databaseId}/documents/posts`;
}

function createSignedJwt() {
  const { clientEmail, privateKey } = getFirestoreAdminConfig();
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };
  const payload = {
    iss: clientEmail,
    scope: FIRESTORE_SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey);
  return `${unsignedToken}.${base64Url(signature)}`;
}

async function getAccessToken() {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  const jwt = createSignedJwt();
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firestore auth token request failed (${response.status}): ${errorText || response.statusText}`);
  }

  const data = await response.json();
  const token = data.access_token as string | undefined;
  const expiresIn = Number(data.expires_in || 3600);

  if (!token) {
    throw new Error('Firestore auth token response did not include access_token.');
  }

  cachedAccessToken = {
    token,
    expiresAt: Date.now() + Math.max(expiresIn - 60, 60) * 1000,
  };

  return token;
}

async function firestoreRequest(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${FIRESTORE_BASE_URL}/${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firestore request failed (${response.status}): ${errorText || response.statusText}`);
  }

  return response;
}

async function listFirestorePosts() {
  const posts: Record<string, any>[] = [];
  let pageToken: string | undefined;
  const { projectId, databaseId } = getFirestoreAdminConfig();

  do {
    const params = new URLSearchParams({
      pageSize: '1000',
    });
    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const response = await firestoreRequest(`projects/${projectId}/databases/${databaseId}/documents/posts?${params.toString()}`, {
      method: 'GET',
    });

    const payload = await response.json();
    const documents: FirestoreDocument[] = Array.isArray(payload.documents) ? payload.documents : [];
    for (const document of documents) {
      posts.push(fromFirestoreDocument(document));
    }
    pageToken = payload.nextPageToken;
  } while (pageToken);

  return posts.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

function resolveCategorySlug(category: string) {
  return CATEGORY_SLUG_MAP[category.trim()];
}

async function updateCategorySlug(docId: string, categorySlug: string) {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  const fields = encodeFirestoreFields({ categorySlug });

  await firestoreRequest(
    `projects/${projectId}/databases/${databaseId}/documents/posts/${encodeURIComponent(docId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }
  );
}

async function main() {
  const posts = await listFirestorePosts();
  let updatedCount = 0;
  let skippedCount = 0;

  for (const post of posts) {
    if (post.categorySlug) {
      skippedCount += 1;
      continue;
    }

    if (typeof post.category !== 'string' || !post.category.trim()) {
      skippedCount += 1;
      continue;
    }

    const categorySlug = resolveCategorySlug(post.category);
    if (!categorySlug) {
      skippedCount += 1;
      continue;
    }

    updatedCount += 1;

    if (!APPLY_MODE) {
      console.log('Would Update:');
      console.log(`id: ${post.id}`);
      console.log(`category: ${post.category}`);
      console.log(`categorySlug: ${categorySlug}`);
      continue;
    }

    await updateCategorySlug(post.id, categorySlug);
    console.log(`Updated ${post.id}: ${post.category} -> ${categorySlug}`);
  }

  if (APPLY_MODE) {
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
  } else {
    console.log(`Would Update: ${updatedCount}`);
    console.log(`Would Skip: ${skippedCount}`);
  }
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
