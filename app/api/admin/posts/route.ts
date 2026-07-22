import { NextResponse } from 'next/server';
import { createSign } from 'crypto';
import firebaseConfig from '../../../../firebase-applet-config.json';

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

type FirestoreRunQueryResponse = {
  document?: FirestoreDocument;
  done?: boolean;
  readTime?: string;
  skippedResults?: number;
  transaction?: string;
};

type FirestoreAdminConfig = {
  projectId: string;
  databaseId: string;
  clientEmail: string;
  privateKey: string;
};

type PublishWorkflowConfig = {
  owner: string;
  repo: string;
  workflowFile: string;
  branch: string;
  token: string | undefined;
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

function getPublishWorkflowConfig(): PublishWorkflowConfig {
  return {
    owner: process.env.GITHUB_OWNER || 'sangini70',
    repo: process.env.GITHUB_REPO || 'robo5',
    workflowFile: process.env.GITHUB_WORKFLOW_FILE || 'publish-json.yml',
    branch: process.env.GITHUB_BRANCH || 'main',
    token: process.env.GITHUB_TOKEN,
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
  console.log("FIRESTORE RAW FIELDS", {
    keys: Object.keys(document.fields ?? {}),
    fields: document.fields,
    title: document.fields?.title,
    slug: document.fields?.slug,
    status: document.fields?.status,
    category: document.fields?.category,
    categorySlug: document.fields?.categorySlug,
    name: document.name,
  });

  const data: Record<string, any> = {};
  const fields = document?.fields || {};

  for (const [key, value] of Object.entries(fields)) {
    data[key] = fromFirestoreValue(value);
  }

  console.log("DECODE RESULT", data);

  if (!data.id && document.name) {
    data.id = document.name.split('/').pop() || data.id;
  }

  return data;
}

function normalizePostDocument(post: Record<string, any>) {
  const normalized = { ...post };
  if (!normalized.id && normalized.slug) {
    normalized.id = normalized.slug;
  }
  return normalized;
}

function getCollectionPath() {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  return `${FIRESTORE_BASE_URL}/projects/${projectId}/databases/${databaseId}/documents/posts`;
}

async function dispatchPublishWorkflow(trigger: 'save' | 'delete', docId: string) {
  const { owner, repo, workflowFile, branch, token } = getPublishWorkflowConfig();

  if (!token) {
    console.warn('PUBLISH WORKFLOW DISPATCH WARNING', {
      trigger,
      docId,
      reason: 'Missing GITHUB_TOKEN',
      owner,
      repo,
      workflowFile,
      branch,
    });
    return false;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflowFile)}/dispatches`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          ref: branch,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('PUBLISH WORKFLOW DISPATCH WARNING', {
        trigger,
        docId,
        owner,
        repo,
        workflowFile,
        branch,
        status: response.status,
        error: errorText || response.statusText,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.warn('PUBLISH WORKFLOW DISPATCH WARNING', {
      trigger,
      docId,
      owner,
      repo,
      workflowFile,
      branch,
      error,
    });
    return false;
  }
}

function getDocumentPath(id: string) {
  return `${getCollectionPath()}/${encodeURIComponent(id)}`;
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

type ListFirestorePostsOptions = {
  pageSize?: number;
  pageToken?: string | null;
};

type FirestorePostsPage = {
  posts: Record<string, any>[];
  nextCursor: string | null;
  hasMore: boolean;
};

type AdminPostsCursor = {
  updatedAt: string;
  name: string;
};

function encodeAdminPostsCursor(cursor: AdminPostsCursor | null): string | null {
  if (!cursor) {
    return null;
  }

  return JSON.stringify(cursor);
}

function decodeAdminPostsCursor(value: string | null): AdminPostsCursor | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    const updatedAt = typeof parsed?.updatedAt === 'string' ? parsed.updatedAt.trim() : '';
    const name = typeof parsed?.name === 'string' ? parsed.name.trim() : '';

    if (!updatedAt || !name) {
      return null;
    }

    const parsedDate = new Date(updatedAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return {
      updatedAt: parsedDate.toISOString(),
      name,
    };
  } catch {
    return null;
  }
}

function extractAdminPostsCursor(document: FirestoreDocument): AdminPostsCursor | null {
  const updatedAtValue = document.fields?.updatedAt && 'timestampValue' in document.fields.updatedAt
    ? document.fields.updatedAt.timestampValue
    : null;

  if (!updatedAtValue || !document.name) {
    return null;
  }

  const parsedDate = new Date(updatedAtValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    updatedAt: parsedDate.toISOString(),
    name: document.name,
  };
}

function parseRunQueryResponses(bodyText: string): FirestoreRunQueryResponse[] {
  const trimmed = bodyText.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed as FirestoreRunQueryResponse[];
    }

    return [parsed as FirestoreRunQueryResponse];
  } catch {
    return trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as FirestoreRunQueryResponse);
  }
}

async function listFirestorePosts(options: ListFirestorePostsOptions = {}): Promise<Record<string, any>[] | FirestorePostsPage> {
  const hasPagedRequest = typeof options.pageSize === 'number' && options.pageSize > 0;

  if (hasPagedRequest) {
    const { projectId, databaseId } = getFirestoreAdminConfig();
    const cursor = decodeAdminPostsCursor(options.pageToken || null);
    const requestBody: Record<string, any> = {
      structuredQuery: {
        from: [
          {
            collectionId: 'posts',
          },
        ],
        orderBy: [
          {
            field: {
              fieldPath: 'updatedAt',
            },
            direction: 'DESCENDING',
          },
          {
            field: {
              fieldPath: '__name__',
            },
            direction: 'DESCENDING',
          },
        ],
        limit: options.pageSize,
      },
    };

    if (cursor) {
      requestBody.structuredQuery.startAt = {
        before: false,
        values: [
          {
            timestampValue: cursor.updatedAt,
          },
          {
            referenceValue: cursor.name,
          },
        ],
      };
    }

    const response = await firestoreRequest(`projects/${projectId}/databases/${databaseId}/documents:runQuery`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const payload = parseRunQueryResponses(await response.text());
    const documents = payload
      .map((entry) => entry.document)
      .filter((document): document is FirestoreDocument => Boolean(document));
    const posts = documents.map((document) => normalizePostDocument(fromFirestoreDocument(document)));
    const nextCursor = documents.length > 0 ? encodeAdminPostsCursor(extractAdminPostsCursor(documents[documents.length - 1])) : null;

    return {
      posts,
      nextCursor,
      hasMore: posts.length === options.pageSize,
    };
  }

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
    console.log('REST DOCUMENT COUNT', documents.length);
    for (const document of documents) {
      console.log('LOOP DOCUMENT', document.name);
      console.log('BEFORE FROM FIRESTORE');
      const decoded = fromFirestoreDocument(document);
      console.log('AFTER FROM FIRESTORE', decoded);
      console.log('BEFORE NORMALIZE');
      const normalized = normalizePostDocument(decoded);
      console.log('AFTER NORMALIZE', normalized);
      posts.push(normalized);
      console.log('POSTS PUSHED', posts.length);
    }
    pageToken = payload.nextPageToken;
  } while (pageToken);

  return posts.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

async function getFirestorePost(id: string) {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  try {
    const response = await firestoreRequest(`projects/${projectId}/databases/${databaseId}/documents/posts/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
    const payload = await response.json();
    return normalizePostDocument(fromFirestoreDocument(payload));
  } catch (error: any) {
    if (String(error?.message || '').includes('(404)')) {
      return null;
    }
    throw error;
  }
}

function buildFirestorePayload(postData: Record<string, any>, mode: 'create' | 'edit', existingPost: Record<string, any> | null) {
  const nowIso = new Date().toISOString();
  const docId = postData.id || Date.now().toString();
  const createdAtValue = normalizeTimestampInput(postData.createdAt)
    || normalizeTimestampInput(existingPost?.createdAt)
    || nowIso;
  const updatedAtValue = nowIso;
  const existingPublishDateValue = normalizeTimestampInput(existingPost?.publishDate);
  const incomingPublishDateValue = normalizeTimestampInput(postData.publishDate);
  const publishDateValue = mode === 'edit' && existingPublishDateValue
    ? existingPublishDateValue
    : incomingPublishDateValue;

  const documentData: Record<string, any> = {
    ...(mode === 'edit' && existingPost ? existingPost : {}),
    ...postData,
    id: docId,
    createdAt: createdAtValue,
    updatedAt: updatedAtValue,
    publishDate: publishDateValue ?? null,
  };

  if (typeof documentData.authorId === 'undefined') {
    delete documentData.authorId;
  }

  return {
    docId,
    documentData,
  };
}

function shouldDispatchPublishWorkflow(
  mode: 'create' | 'edit',
  documentData: Record<string, any>,
  existingPost: Record<string, any> | null
) {
  const nextStatus = String(documentData.status ?? existingPost?.status ?? '').trim();
  if (nextStatus !== 'published') {
    return false;
  }

  const publishDateValue = normalizeTimestampInput(documentData.publishDate ?? existingPost?.publishDate);
  if (publishDateValue) {
    const publishDate = new Date(publishDateValue);
    if (!Number.isNaN(publishDate.getTime()) && publishDate > new Date()) {
      return false;
    }
  }

  return mode === 'create' || mode === 'edit';
}

async function writeFirestorePost(postData: Record<string, any>) {
  const mode: 'create' | 'edit' = postData.id ? 'edit' : 'create';
  const docId = postData.id || Date.now().toString();
  const existingPost = mode === 'edit' ? await getFirestorePost(docId) : null;
  const { documentData } = buildFirestorePayload({ ...postData, id: docId }, mode, existingPost);
  const fields = encodeFirestoreFields(documentData);
  const { projectId, databaseId } = getFirestoreAdminConfig();
  const updateMask = new URLSearchParams();

  for (const key of Object.keys(documentData).filter((key) => key.trim())) {
    updateMask.append('updateMask.fieldPaths', key);
  }

  await firestoreRequest(
    `projects/${projectId}/databases/${databaseId}/documents/posts/${encodeURIComponent(docId)}?${updateMask.toString()}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }
  );

  const workflowTriggered = shouldDispatchPublishWorkflow(mode, documentData, existingPost)
    ? await dispatchPublishWorkflow('save', docId)
    : false;

  return {
    docId,
    saved: true,
    published: false,
    publishMode: 'manual' as const,
    nextStep: workflowTriggered
      ? 'GitHub Actions workflow dispatched for JSON export.'
      : 'Firestore save completed. JSON export trigger failed; check GitHub Actions.',
  };
}

async function deleteFirestorePost(id: string) {
  const { projectId, databaseId } = getFirestoreAdminConfig();
  try {
    await firestoreRequest(
      `projects/${projectId}/databases/${databaseId}/documents/posts/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );
  } catch (error: any) {
    if (!String(error?.message || '').includes('(404)')) {
      throw error;
    }
  }

  const workflowTriggered = await dispatchPublishWorkflow('delete', id);

  return {
    saved: true,
    published: false,
    publishMode: 'manual' as const,
    nextStep: workflowTriggered
      ? 'GitHub Actions workflow dispatched for JSON export.'
      : 'Firestore save completed. JSON export trigger failed; check GitHub Actions.',
  };
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const hasPagedQuery = requestUrl.searchParams.has('limit') || requestUrl.searchParams.has('cursor');

    if (hasPagedQuery) {
      const requestedLimit = Number(requestUrl.searchParams.get('limit') || '10');
      const pageSize = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 10) : 10;
      const cursor = requestUrl.searchParams.get('cursor');
      const page = await listFirestorePosts({
        pageSize,
        pageToken: cursor || null,
      });

      if (Array.isArray(page)) {
        return NextResponse.json({
          success: true,
          posts: page,
          nextCursor: null,
          hasMore: false,
          pageSize,
        });
      }

      console.log('ADMIN POSTS SOURCE DEBUG', {
        dataSource: 'Firestore posts collection',
        postsCount: page.posts.length,
        firstSlug: page.posts[0]?.slug ?? null,
        pageSize,
        cursor: cursor || null,
      });
      console.log('ADMIN POSTS RESPONSE FIRST', page.posts[0] ?? null);
      return NextResponse.json({
        success: true,
        posts: page.posts,
        nextCursor: page.nextCursor,
        hasMore: page.hasMore,
        pageSize,
      });
    }

    const posts = await listFirestorePosts();
    console.log('ADMIN POSTS SOURCE DEBUG', {
      dataSource: 'Firestore posts collection',
      postsCount: Array.isArray(posts) ? posts.length : 0,
      firstSlug: Array.isArray(posts) ? posts[0]?.slug ?? null : null,
    });
    console.log('ADMIN POSTS RESPONSE FIRST', Array.isArray(posts) ? posts[0] ?? null : null);
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('ADMIN POSTS GET ERROR', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const postData = await request.json();
    const publishResult = await writeFirestorePost(postData);

    return NextResponse.json({
      success: true,
      ...publishResult,
    });
  } catch (error: any) {
    console.error('Firestore POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const publishResult = await deleteFirestorePost(id);
    return NextResponse.json({
      success: true,
      ...publishResult,
    });
  } catch (error: any) {
    console.error('Firestore DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
