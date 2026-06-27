import { NextResponse } from 'next/server';
import { createSign } from 'crypto';
import firebaseConfig from '../../../../../firebase-applet-config.json';

type RestoreBackupPayload = {
  source: unknown;
  count: unknown;
  exportedAt: unknown;
  posts: unknown;
  mode?: unknown;
};

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

type FirestoreAdminConfig = {
  projectId: string;
  databaseId: string;
  clientEmail: string;
  privateKey: string;
};

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
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

function isRestoreBackupPayload(value: unknown): value is RestoreBackupPayload {
  return Boolean(value && typeof value === 'object');
}

function validateRestoreBackupPayload(payload: RestoreBackupPayload) {
  const errors: string[] = [];

  if (payload.source !== 'firestore.posts') {
    errors.push('source must be "firestore.posts".');
  }

  if (typeof payload.count !== 'number' || !Number.isFinite(payload.count) || payload.count < 0) {
    errors.push('count must be a non-negative number.');
  }

  if (typeof payload.exportedAt !== 'string' || !payload.exportedAt.trim()) {
    errors.push('exportedAt must be a non-empty string.');
  }

  if (!Array.isArray(payload.posts)) {
    errors.push('posts must be an array.');
  }

  return errors;
}

function validateRestorePlanSample(sample: unknown) {
  if (!sample || typeof sample !== 'object' || Array.isArray(sample)) {
    return 'The first post must be a JSON object.';
  }

  const samplePost = sample as Record<string, unknown>;
  const sampleId = samplePost.id;
  if (typeof sampleId !== 'string' || !sampleId.trim()) {
    return 'The first post must include a string id.';
  }

  return null;
}

function buildFieldKeys(record: Record<string, unknown>) {
  const fieldKeys: string[] = [];
  for (const key of Object.keys(record)) {
    if (key.trim().length > 0) {
      fieldKeys.push(key);
    }
  }
  return fieldKeys;
}

function buildUpdateMaskFieldPaths(record: Record<string, unknown>) {
  const updateMaskFieldPaths: string[] = [];
  for (const key of Object.keys(record)) {
    if (key.trim().length > 0) {
      updateMaskFieldPaths.push(key);
    }
  }
  return updateMaskFieldPaths;
}

function buildDryRunSample(sample: Record<string, unknown>) {
  const id = sample.id as string;
  const fieldKeys = buildFieldKeys(sample);
  const updateMaskFieldPaths = buildUpdateMaskFieldPaths(sample);

  return {
    id,
    fieldKeys,
    updateMaskFieldPaths,
  };
}

async function getAccessToken() {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  const { clientEmail, privateKey } = getFirestoreAdminConfig();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: clientEmail,
    scope: FIRESTORE_SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedClaim = base64Url(JSON.stringify(claim));
  const unsignedToken = `${encodedHeader}.${encodedClaim}`;

  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey);
  const jwt = `${unsignedToken}.${base64Url(signature)}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }).toString(),
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

async function patchSinglePost(post: Record<string, unknown>) {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  const id = post.id as string;
  const updateMask = new URLSearchParams();

  for (const key of Object.keys(post)) {
    if (key.trim().length > 0) {
      updateMask.append('updateMask.fieldPaths', key);
    }
  }

  const response = await firestoreRequest(
    `projects/${projectId}/databases/${databaseId}/documents/posts/${encodeURIComponent(id)}?${updateMask.toString()}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        fields: encodeFirestoreFields(post),
      }),
    }
  );

  return response.json();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isRestoreBackupPayload(body)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request body must be a JSON object.',
        },
        { status: 400 }
      );
    }

    const errors = validateRestoreBackupPayload(body);
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid restore backup payload.',
          errors,
        },
        { status: 400 }
      );
    }

    const posts = body.posts as unknown[];
    if (posts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'posts must contain at least one item.',
        },
        { status: 400 }
      );
    }

    const firstPost = posts[0];
    const sampleError = validateRestorePlanSample(firstPost);
    if (sampleError) {
      return NextResponse.json(
        {
          success: false,
          error: sampleError,
        },
        { status: 400 }
      );
    }

    const samplePost = firstPost as Record<string, unknown>;
    const sample = buildDryRunSample(samplePost);

    if (body.mode !== 'apply') {
      return NextResponse.json({
        success: true,
        dryRun: true,
        nextStep: 'Review dry-run result before applying restore.',
        warning: 'Dry-run only. No Firestore data was changed.',
        source: body.source,
        count: body.count,
        exportedAt: body.exportedAt,
        postsCount: posts.length,
        sample,
      });
    }

    let successCount = 0;
    let failureCount = 0;
    const appliedIds: string[] = [];
    const failed: Array<{ id: string; error: string }> = [];

    for (const post of posts) {
      if (!post || typeof post !== 'object' || Array.isArray(post)) {
        failureCount += 1;
        continue;
      }

      const postRecord = post as Record<string, unknown>;
      const id = postRecord.id;
      if (typeof id !== 'string' || !id.trim()) {
        failureCount += 1;
        failed.push({ id: '', error: 'Missing string id.' });
        continue;
      }

      try {
        await patchSinglePost(postRecord);
        successCount += 1;
        appliedIds.push(id);
      } catch (error: any) {
        failureCount += 1;
        failed.push({
          id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      success: true,
      dryRun: false,
      nextStep: 'Run npm run sync-json before publishing.',
      warning: 'Firestore restore is complete, but public JSON files are not updated until sync-json runs.',
      source: body.source,
      count: body.count,
      exportedAt: body.exportedAt,
      postsCount: posts.length,
      summary: {
        successCount,
        failureCount,
        totalCount: posts.length,
      },
      sample,
      appliedIds,
      failed,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}
