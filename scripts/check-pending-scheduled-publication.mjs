import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const FIRESTORE_SCOPE = 'https://www.googleapis.com/auth/datastore';
const FIRESTORE_BASE_URL = 'https://firestore.googleapis.com/v1';
const DEFAULT_WORKFLOW_FILE = 'publish-json.yml';
const DEFAULT_BRANCH = 'main';

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

function readFirebaseConfig() {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return {
    projectId: parsed.projectId || process.env.FIREBASE_PROJECT_ID,
    databaseId: parsed.firestoreDatabaseId || '(default)',
  };
}

function getGitHubConfig() {
  const repository = process.env.GITHUB_REPOSITORY || '';
  const [repoOwner, repoName] = repository.includes('/')
    ? repository.split('/', 2)
    : [process.env.GITHUB_OWNER || 'sangini70', process.env.GITHUB_REPO || 'robo5'];

  return {
    owner: repoOwner,
    repo: repoName,
    workflowFile: process.env.GITHUB_WORKFLOW_FILE || DEFAULT_WORKFLOW_FILE,
    branch: process.env.GITHUB_BRANCH || DEFAULT_BRANCH,
    token: process.env.GITHUB_TOKEN,
  };
}

function base64Url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function normalizeTimestampInput(value) {
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

function createSignedJwt(clientEmail, privateKey) {
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
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey);
  return `${unsignedToken}.${base64Url(signature)}`;
}

async function getAccessToken(projectId) {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firestore auth env variables.');
  }

  const jwt = createSignedJwt(clientEmail, privateKey.replace(/\\n/g, '\n'));
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
  const token = data.access_token;
  if (!token) {
    throw new Error('Firestore auth token response did not include access_token.');
  }

  return token;
}

async function firestoreRequest(projectId, databaseId, token, pathSuffix, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${FIRESTORE_BASE_URL}/${pathSuffix}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firestore request failed (${response.status}): ${errorText || response.statusText}`);
  }

  return response;
}

function parseRunQueryResponses(bodyText) {
  const trimmed = bodyText.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }
}

function extractCandidatePublishDate(document) {
  const value = document?.fields?.publishDate;
  if (!value || !('timestampValue' in value)) {
    return null;
  }

  const parsed = normalizeTimestampInput(value.timestampValue);
  return parsed ? new Date(parsed) : null;
}

function writeOutput(key, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  fs.appendFileSync(outputPath, `${key}=${String(value)}\n`, 'utf8');
}

async function getLastSuccessfulRunStartedAt() {
  const { owner, repo, workflowFile, branch, token } = getGitHubConfig();

  if (!token) {
    console.warn('GATE WARNING', {
      reason: 'Missing GITHUB_TOKEN',
      owner,
      repo,
      workflowFile,
      branch,
    });
    return null;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflowFile)}/runs?branch=${encodeURIComponent(branch)}&status=success&per_page=1`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.warn('GATE WARNING', {
      reason: 'GitHub workflow run lookup failed',
      owner,
      repo,
      workflowFile,
      branch,
      status: response.status,
      error: errorText || response.statusText,
    });
    return null;
  }

  const payload = await response.json();
  const run = Array.isArray(payload.workflow_runs) ? payload.workflow_runs[0] : null;
  const startedAt = normalizeTimestampInput(run?.run_started_at || run?.created_at);

  if (!startedAt) {
    console.warn('GATE WARNING', {
      reason: 'No successful workflow run timestamp found',
      owner,
      repo,
      workflowFile,
      branch,
    });
    return null;
  }

  return startedAt;
}

async function hasPendingScheduledPublication() {
  const { projectId, databaseId } = readFirebaseConfig();
  const accessToken = await getAccessToken(projectId);
  const watermark = await getLastSuccessfulRunStartedAt();
  const nowIso = new Date().toISOString();

  if (!watermark) {
    return {
      hasPending: true,
      reason: 'missing_watermark',
      watermark: null,
      candidateCount: null,
    };
  }

  const response = await firestoreRequest(projectId, databaseId, accessToken, `projects/${projectId}/databases/${databaseId}/documents:runQuery`, {
    method: 'POST',
    body: JSON.stringify({
      structuredQuery: {
        from: [
          {
            collectionId: 'posts',
          },
        ],
        where: {
          compositeFilter: {
            op: 'AND',
            filters: [
              {
                fieldFilter: {
                  field: {
                    fieldPath: 'publishDate',
                  },
                  op: 'GREATER_THAN',
                  value: {
                    timestampValue: watermark,
                  },
                },
              },
              {
                fieldFilter: {
                  field: {
                    fieldPath: 'publishDate',
                  },
                  op: 'LESS_THAN_OR_EQUAL',
                  value: {
                    timestampValue: nowIso,
                  },
                },
              },
            ],
          },
        },
        orderBy: [
          {
            field: {
              fieldPath: 'publishDate',
            },
            direction: 'ASCENDING',
          },
        ],
        limit: 1,
      },
    }),
  });

  const payload = parseRunQueryResponses(await response.text());
  const candidate = payload.find((entry) => entry?.document?.name && extractCandidatePublishDate(entry.document));

  return {
    hasPending: Boolean(candidate),
    reason: candidate ? 'pending_publication_found' : 'no_pending_publication',
    watermark,
    candidateCount: candidate ? 1 : 0,
  };
}

async function main() {
  try {
    const result = await hasPendingScheduledPublication();
    writeOutput('has_pending_publication', result.hasPending ? 'true' : 'false');
    writeOutput('gate_reason', result.reason);
    writeOutput('last_success_started_at', result.watermark || '');
    writeOutput('candidate_count', String(result.candidateCount ?? ''));

    console.log('Scheduled publication gate result:', result);
    process.exit(0);
  } catch (error) {
    console.warn('Scheduled publication gate failed open:', error);
    writeOutput('has_pending_publication', 'true');
    writeOutput('gate_reason', 'verification_failed');
    writeOutput('last_success_started_at', '');
    writeOutput('candidate_count', '');
    process.exit(0);
  }
}

loadEnvLocal();
main();
