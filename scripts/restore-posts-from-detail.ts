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
  | { referenceValue: string }
  | { bytesValue: string }
  | { geoPointValue: { latitude: number; longitude: number } }
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
const DETAIL_DIR = path.join(process.cwd(), 'public', 'data', 'ko', 'detail');
const POSTS_JSON_PATH = path.join(process.cwd(), 'public', 'data', 'posts.json');
const SHOULD_APPLY = process.argv.includes('--apply');
const APPLY_ONE_FLAG = '--apply-one';

function getArgValue(flag: string) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  const value = process.argv[index + 1];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

const APPLY_ONE_DOC_ID = getArgValue(APPLY_ONE_FLAG);

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
    throw new Error('FIREBASE_PROJECT_ID is required for Firestore restore access.');
  }
  if (!clientEmail) {
    throw new Error('FIREBASE_CLIENT_EMAIL is required for Firestore restore access.');
  }
  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY is required for Firestore restore access.');
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

function normalizeValue(value: any): any {
  if (value == null) return value;

  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeValue(nestedValue)])
    );
  }

  return value;
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

function fromFirestoreValue(value: any): any {
  if (value === null || value === undefined) return null;

  if (typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => fromFirestoreValue(item));
  }

  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('referenceValue' in value) return value.referenceValue;
  if ('bytesValue' in value) return value.bytesValue;
  if ('geoPointValue' in value) {
    return {
      latitude: Number(value.geoPointValue.latitude),
      longitude: Number(value.geoPointValue.longitude),
    };
  }

  if ('arrayValue' in value) {
    return (value.arrayValue.values || []).map((item: any) => fromFirestoreValue(item));
  }

  if ('mapValue' in value) {
    const result: Record<string, any> = {};
    const fields = value.mapValue.fields || {};
    for (const [key, nestedValue] of Object.entries(fields)) {
      result[key] = fromFirestoreValue(nestedValue);
    }
    return result;
  }

  const result: Record<string, any> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    result[key] = fromFirestoreValue(nestedValue);
  }
  return result;
}

function fromFirestoreDocument(document: FirestoreDocument) {
  const data: Record<string, any> = {};
  const fields = document?.fields || {};

  for (const [key, value] of Object.entries(fields)) {
    data[key] = fromFirestoreValue(value);
  }

  if (!data.id && document.name) {
    data.id = document.name.split('/').pop() || data.id;
  }

  return data;
}

function encodeFirestoreFields(data: Record<string, any>) {
  const fields: Record<string, FirestoreValue> = {};

  for (const [key, value] of Object.entries(data)) {
    const normalized = normalizeValue(value);

    if (normalized === undefined) continue;
    if (normalized === null) {
      fields[key] = { nullValue: null };
      continue;
    }

    if (key === 'createdAt' || key === 'updatedAt' || key === 'publishDate') {
      const timestampValue = normalizeTimestampInput(normalized);
      if (timestampValue) {
        fields[key] = { timestampValue };
        continue;
      }
    }

    if (Array.isArray(normalized)) {
      fields[key] = {
        arrayValue: {
          values: normalized.map((item) => encodeScalarValue(item)),
        },
      };
      continue;
    }

    fields[key] = encodeScalarValue(normalized);
  }

  return fields;
}

function encodeScalarValue(value: any): FirestoreValue {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => encodeScalarValue(item)),
      },
    };
  }
  if (value && typeof value === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      fields[key] = encodeScalarValue(nestedValue);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function getCollectionPath() {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  return `${FIRESTORE_BASE_URL}/projects/${projectId}/databases/${databaseId}/documents/posts`;
}

function createSignedJwt() {
  const { clientEmail, privateKey } = getFirestoreAdminConfig();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
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

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

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

function readDetailPosts() {
  if (!fs.existsSync(DETAIL_DIR)) {
    throw new Error(`Detail directory not found: ${DETAIL_DIR}`);
  }

  return fs
    .readdirSync(DETAIL_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const filePath = path.join(DETAIL_DIR, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const detail = JSON.parse(raw);
      return {
        ...detail,
        __file: file,
      };
    });
}

function readPostsJson() {
  if (!fs.existsSync(POSTS_JSON_PATH)) {
    throw new Error(`posts.json not found: ${POSTS_JSON_PATH}`);
  }

  const raw = fs.readFileSync(POSTS_JSON_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function buildPostsById(posts: Record<string, any>[]) {
  const postsById = new Map<string, Record<string, any>>();

  for (const post of posts) {
    const id = typeof post.id === 'string' ? post.id.trim() : '';
    if (id) {
      postsById.set(id, post);
    }
  }

  return postsById;
}

function buildPostsBySlug(posts: Record<string, any>[]) {
  const postsBySlug = new Map<string, Record<string, any>>();

  for (const post of posts) {
    const slug = typeof post.slug === 'string' ? post.slug.trim() : '';
    if (slug) {
      postsBySlug.set(slug, post);
    }
  }

  return postsBySlug;
}

function buildRestorePayload(
  firestorePost: Record<string, any>,
  detail: Record<string, any>,
  masterPost: Record<string, any>
): Record<string, any> {
  const { __file, ...detailData } = detail;

  return {
    ...detailData,
    id: masterPost.id,
    categorySlug: detailData.categorySlug ?? firestorePost.categorySlug ?? masterPost.categorySlug ?? null,
  };
}

async function updateFirestorePost(docId: string, payload: Record<string, any>) {
  await firestoreRequest(`projects/${getFirestoreAdminConfig().projectId}/databases/${getFirestoreAdminConfig().databaseId}/documents/posts/${docId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: encodeFirestoreFields(payload),
    }),
  });
}

async function main() {
  const firestorePosts = await listFirestorePosts();
  const firestoreById = new Map<string, Record<string, any>>();

  for (const post of firestorePosts) {
    if (typeof post.id === 'string' && post.id.trim()) {
      firestoreById.set(post.id, post);
    }
  }

  const masterPosts = readPostsJson();
  const postsById = buildPostsById(masterPosts);
  const postsBySlug = buildPostsBySlug(masterPosts);
  const details = readDetailPosts();

  if (APPLY_ONE_DOC_ID) {
    const masterPost = postsById.get(APPLY_ONE_DOC_ID);
    if (!masterPost || typeof masterPost.slug !== 'string' || !masterPost.slug.trim()) {
      console.log('Applied One:');
      console.log(`docId: ${APPLY_ONE_DOC_ID}`);
      console.log('slug:');
      console.log('title:');
      console.log('category:');
      console.log('status:');
      return;
    }

    const slug = masterPost.slug.trim();
    const detail = details.find((item) => item.slug === slug);
    const firestorePost = firestoreById.get(APPLY_ONE_DOC_ID);

    if (!detail || !firestorePost) {
      console.log('Applied One:');
      console.log(`docId: ${APPLY_ONE_DOC_ID}`);
      console.log(`slug: ${slug}`);
      console.log(`title: ${detail?.title ?? ''}`);
      console.log(`category: ${detail?.category ?? ''}`);
      console.log(`status: ${detail?.status ?? ''}`);
      return;
    }

    const restorePayload = buildRestorePayload(firestorePost, detail, masterPost);

    console.log('docId:', JSON.stringify(APPLY_ONE_DOC_ID, null, 2));
    console.log('slug:', JSON.stringify(slug, null, 2));
    console.log('detailData:', JSON.stringify(detail, null, 2));
    console.log('payload:', JSON.stringify(restorePayload, null, 2));

    await updateFirestorePost(APPLY_ONE_DOC_ID, restorePayload);

    console.log('Applied One:');
    console.log(`docId: ${APPLY_ONE_DOC_ID}`);
    console.log(`slug: ${slug}`);
    console.log(`title: ${restorePayload.title ?? ''}`);
    console.log(`category: ${restorePayload.category ?? ''}`);
    console.log(`status: ${restorePayload.status ?? ''}`);
    return;
  }

  let matchedCount = 0;
  let skippedCount = 0;

  for (const detail of details) {
    const slug = typeof detail.slug === 'string' ? detail.slug.trim() : '';
    if (!slug) {
      skippedCount += 1;
      continue;
    }

    const masterPost = postsBySlug.get(slug);
    if (!masterPost || typeof masterPost.id !== 'string' || !masterPost.id.trim()) {
      skippedCount += 1;
      continue;
    }

    const firestorePost = firestoreById.get(masterPost.id);
    const isSame = Boolean(firestorePost);

    if (!isSame) {
      skippedCount += 1;
      continue;
    }

    matchedCount += 1;

    const restorePayload = buildRestorePayload(firestorePost, detail, masterPost);

    if (SHOULD_APPLY) {
      await updateFirestorePost(masterPost.id, restorePayload);
    } else {
      console.log('Would Update:');
      console.log(`id: ${masterPost.id}`);
      console.log(`detail slug: ${slug}`);
      console.log(`same: ${firestorePost.id === masterPost.id}`);
      console.log('---');
    }
  }

  console.log(`Would Update: ${matchedCount}`);
  console.log(`Would Skip: ${skippedCount}`);
  console.log(`Matched: ${matchedCount}`);
  console.log(`Skipped: ${skippedCount}`);
}

main().catch((error) => {
  console.error('Restore dry-run failed:', error);
  process.exit(1);
});
