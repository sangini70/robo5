import { NextResponse } from 'next/server';
import { createSign } from 'crypto';
import firebaseConfig from '../../../firebase-applet-config.json';

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

async function updateFirestorePostViews(postId: string) {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  const document = `projects/${projectId}/databases/${databaseId}/documents/posts/${encodeURIComponent(postId)}`;
  const response = await firestoreRequest(
    `projects/${projectId}/databases/${databaseId}/documents:commit`,
    {
      method: 'POST',
      body: JSON.stringify({
        writes: [
          {
            currentDocument: { exists: true },
            transform: {
              document,
              fieldTransforms: [
                {
                  fieldPath: 'postViews',
                  increment: { integerValue: '1' },
                },
              ],
            },
          },
        ],
      }),
    }
  );

  const payload = await response.json();
  const views = payload?.writeResults?.[0]?.transformResults?.[0]?.integerValue;
  return typeof views === 'string' ? Number(views) : null;
}

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();
    if (typeof postId !== 'string' || !postId.trim()) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const views = await updateFirestorePostViews(postId.trim());
    return NextResponse.json({ success: true, views });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
