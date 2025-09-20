import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: 'qrify-s7573',
  appId: '1:620181817388:web:58c43d6a7db4e4a7236989',
  storageBucket: 'qrify-s7573.appspot.com',
  apiKey: 'AIzaSyAQ4G_p0cej4LJOooD5jNxyOuc5GNAWJk8',
  authDomain: 'qrify-s7573.firebaseapp.com',
  messagingSenderId: '620181817388',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
