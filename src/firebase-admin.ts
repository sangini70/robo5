import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../firebase-applet-config.json';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: config.projectId,
  });
}

// Use the specific database ID from config if it exists, otherwise default
export const adminDb = getFirestore(config.firestoreDatabaseId || '(default)');
export const adminAuth = admin.auth();
