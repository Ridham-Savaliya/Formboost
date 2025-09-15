// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_APIKEY,
  authDomain: import.meta.env.VITE_FB_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECTID,
  storageBucket: import.meta.env.VITE_FB_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FB_APPID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENTID,
};

// Initialize Firebase
let firebaseApp;
try {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase');
}

// Initialize Firebase services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Basic runtime validation to surface common misconfigurations early
(() => {
  const requiredEnvVars = {
    VITE_FB_APIKEY: firebaseConfig.apiKey,
    VITE_FB_AUTHDOMAIN: firebaseConfig.authDomain,
    VITE_FB_PROJECTID: firebaseConfig.projectId,
  };
  
  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(
      'Missing required Firebase environment variables:\n',
      missing.join('\n ')
    );
    console.warn(
      'Firebase may not work as expected without these variables.\n' +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate storage bucket format if present
  if (firebaseConfig.storageBucket && 
      firebaseConfig.storageBucket.endsWith('firebasestorage.app')) {
    console.warn(
      "[Firebase] storageBucket usually ends with '.appspot.com'. Current:",
      firebaseConfig.storageBucket,
      "— copy the exact value from Firebase Console > Project settings > Web app config."
    );
  }
})();

export { firebaseApp, auth, db, storage };
