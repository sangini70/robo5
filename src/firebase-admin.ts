import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../firebase-applet-config.json';

const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ?.trim()
  ?.replace(/^"|"$/g, '')
  ?.replace(/\\n/g, '\n');

// [ENV CHECK] Firebase Admin Environment Variables
console.log('[ENV CHECK] Starting Firebase Admin Initialization...');
console.log('[ENV CHECK] FIREBASE_PROJECT_ID exists:', !!projectId);
if (projectId) console.log('[ENV CHECK] FIREBASE_PROJECT_ID length:', projectId.length);
console.log('[ENV CHECK] FIREBASE_CLIENT_EMAIL exists:', !!clientEmail);
if (clientEmail) console.log('[ENV CHECK] FIREBASE_CLIENT_EMAIL length:', clientEmail.length);
console.log('[ENV CHECK] FIREBASE_PRIVATE_KEY exists:', !!privateKey);
if (privateKey) {
  console.log('[ENV CHECK] FIREBASE_PRIVATE_KEY length:', privateKey.length);
  console.log('[ENV CHECK] startsWith BEGIN:', privateKey.startsWith('-----BEGIN PRIVATE KEY-----'));
  console.log('[ENV CHECK] endsWith END:', privateKey.endsWith('-----END PRIVATE KEY-----'));
}
console.log('[ENV CHECK] using service account only');

if (!projectId || !clientEmail || !privateKey) {
  throw new Error('Missing Firebase Admin env variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY)');
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('Firebase Admin initialized successfully with Cert.');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin with Cert:', error);
    throw error;
  }
}

// Use the specific database ID from config if it exists, otherwise default
export const adminDb = getFirestore(config.firestoreDatabaseId || '(default)');
export const adminAuth = admin.auth();
