import fs from 'fs';
import path from 'path';
import { createSign } from 'crypto';
import { writeJsonArtifacts } from '../src/lib/sync-json-artifacts';
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
    throw new Error('FIREBASE_PROJECT_ID is required for Firestore export.');
  }
  if (!clientEmail) {
    throw new Error('FIREBASE_CLIENT_EMAIL is required for Firestore export.');
  }
  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY is required for Firestore export.');
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

function normalizeMasterValue(value: any): any {
  if (value == null) return value;
  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(normalizeMasterValue);
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeMasterValue(nestedValue)])
    );
  }
  return value;
}

function normalizeMasterPosts(posts: any[]) {
  return posts.map((post: any, index: number) => ({
    ...normalizeMasterValue(post),
    id: post.id ?? post.slug ?? String(index + 1),
  }));
}

function filterPublicPosts(posts: any[]) {
  const now = new Date();
  return posts
    .filter(post => {
      if (post.status !== 'published') return false;
      const publishDate = post.publishDate ? new Date(post.publishDate) : null;
      if (publishDate && publishDate > now) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishDate || a.createdAt).getTime();
      const dateB = new Date(b.publishDate || b.createdAt).getTime();
      return dateB - dateA;
    });
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

function normalizeFirestorePost(post: Record<string, any>, index: number) {
  const normalized = normalizeMasterValue(post);
  return {
    ...normalized,
    id: normalized.id ?? normalized.slug ?? String(index + 1),
    createdAt: normalizeTimestampInput(normalized.createdAt) ?? normalized.createdAt ?? null,
    updatedAt: normalizeTimestampInput(normalized.updatedAt) ?? normalized.updatedAt ?? null,
    publishDate: normalizeTimestampInput(normalized.publishDate) ?? normalized.publishDate ?? null,
    titleHistory: Array.isArray(normalized.titleHistory)
      ? normalized.titleHistory.map((history: any) => ({
          ...normalizeMasterValue(history),
          changedAt: normalizeTimestampInput(history?.changedAt) ?? history?.changedAt ?? null,
        }))
      : normalized.titleHistory ?? [],
  };
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
    console.log(JSON.stringify(payload, null, 2));
    const documents: FirestoreDocument[] = Array.isArray(payload.documents) ? payload.documents : [];
    for (const [index, document] of documents.entries()) {
      posts.push(normalizeFirestorePost(fromFirestoreDocument(document), posts.length + index + 1));
    }
    pageToken = payload.nextPageToken;
  } while (pageToken);

  return posts.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

async function main() {
  console.log('Starting Firestore sync-json script...');
  console.log('Reading posts from Firestore posts collection...');

  const firestorePosts = await listFirestorePosts();
  const publicPosts = filterPublicPosts(normalizeMasterPosts(firestorePosts));

  console.log(`Loaded ${firestorePosts.length} posts from Firestore posts collection.`);
  console.log(`Fetched ${publicPosts.length} published posts from Firestore posts collection.`);

  writeJsonArtifacts(publicPosts);
  console.log('Firestore sync-json complete.');
}

main().catch((error) => {
  console.error('Firestore sync-json failed:', error);
  process.exit(1);
});
