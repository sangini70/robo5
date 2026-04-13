import * as admin from 'firebase-admin';
import firebaseConfig from '../firebase-applet-config.json';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

// Use the specific database ID if provided
export const adminDb = admin.firestore(firebaseConfig.firestoreDatabaseId);
console.log(`Admin SDK initialized for project: ${firebaseConfig.projectId}, database: ${firebaseConfig.firestoreDatabaseId}`);
export const adminAuth = admin.auth();
