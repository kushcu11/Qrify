import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'qrify-s7573',
  appId: '1:620181817388:web:58c43d6a7db4e4a7236989',
  storageBucket: 'qrify-s7573.firebasestorage.app',
  apiKey: 'AIzaSyAQ4G_p0cej4LJOooD5jNxyOuc5GNAWJk8',
  authDomain: 'qrify-s7573.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '620181817388',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
