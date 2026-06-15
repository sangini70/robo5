import { NextResponse } from 'next/server';
import { createSign } from 'crypto';
import firebaseConfig from '../../../firebase-applet-config.json';

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

function normalizeFirestoreValue(value: any): any {
  if (value == null) return value;
  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(normalizeFirestoreValue);
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeFirestoreValue(nestedValue)])
    );
  }
  return value;
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

function normalizePostDocument(post: Record<string, any>) {
  const normalized = { ...normalizeFirestoreValue(post) };
  if (!normalized.id && normalized.slug) {
    normalized.id = normalized.slug;
  }

  return normalized;
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

async function findFirestorePostBySlug(slug: string) {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  const response = await firestoreRequest(`projects/${projectId}/databases/${databaseId}/documents:runQuery`, {
    method: 'POST',
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'posts' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'slug' },
            op: 'EQUAL',
            value: { stringValue: slug },
          },
        },
        limit: 1,
      },
    }),
  });

  const payload = await response.json();
  const hit = Array.isArray(payload)
    ? payload.find((item: any) => item?.document?.name)
    : null;

  if (!hit?.document) {
    return null;
  }

  return normalizePostDocument(fromFirestoreDocument(hit.document));
}

async function updateFirestorePostViews(post: Record<string, any>) {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  const docId = post.id || post.slug;
  const currentViews = Number(post.postViews || 0);
  const nextViews = currentViews + 1;

  await firestoreRequest(
    `projects/${projectId}/databases/${databaseId}/documents/posts/${encodeURIComponent(docId)}?updateMask.fieldPaths=postViews`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          postViews: {
            integerValue: String(nextViews),
          },
        },
      }),
    }
  );

  return nextViews;
}

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    const post = await findFirestorePostBySlug(slug);
    if (!post) {
      return NextResponse.json({ success: true, views: 0 });
    }

    const views = await updateFirestorePostViews(post);
    return NextResponse.json({ success: true, views });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
