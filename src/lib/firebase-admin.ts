import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!admin.apps.length) {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
        console.warn("Firebase Admin SDK service account not found. Some features may not work.");
        // Initialize without credentials for local dev if needed, though some actions will fail
        admin.initializeApp();
    }
}


export const adminApp = admin.app();
