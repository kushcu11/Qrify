import * as admin from 'firebase-admin';

// This is a workaround for the Vercel deployment environment.
// The private key needs to have newline characters correctly formatted.
const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY).private_key.replace(/\\n/g, '\n')
  : undefined;

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? {
      ...JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY),
      private_key: privateKey,
    }
  : null;


if (!admin.apps.length) {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
        console.warn("Firebase Admin SDK service account not found. Some features may not work.");
        // Initialize without credentials for local dev if needed, though some actions will fail
        // admin.initializeApp();
    }
}

export const adminApp = admin.apps.length ? admin.app() : null;
