// COMMENTED OUT - Firebase configuration disabled for API-only functionality
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_APIKEY,
  authDomain: import.meta.env.VITE_FB_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECTID,
  storageBucket: import.meta.env.VITE_FB_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FB_APPID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENTID,
};

// Basic runtime validation to surface common misconfigurations early
(() => {
  const missing = Object.entries({
    VITE_FB_APIKEY: firebaseConfig.apiKey,
    VITE_FB_AUTHDOMAIN: firebaseConfig.authDomain,
    VITE_FB_PROJECTID: firebaseConfig.projectId,
    VITE_FB_STORAGEBUCKET: firebaseConfig.storageBucket,
    VITE_FB_MESSAGINGSENDERID: firebaseConfig.messagingSenderId,
    VITE_FB_APPID: firebaseConfig.appId,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error(
      "[Firebase] Missing env vars:",
      missing.join(", "),
      "— ensure your .env(.local) is placed in the Vite project root and restart dev server."
    );
  }

  if (
    firebaseConfig.storageBucket &&
    firebaseConfig.storageBucket.endsWith("firebasestorage.app")
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      "[Firebase] storageBucket usually ends with '.appspot.com'. Current:",
      firebaseConfig.storageBucket,
      "— copy the exact value from Firebase Console > Project settings > Web app config."
    );
  }
})();

// Initialize Firebase - HMR-safe pattern with additional safeguards
let app = null;
let auth = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  // Initialize Auth with safeguards
  if (app) {
    auth = getAuth(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, auth };

// Note: ensure you have Vite env vars configured in your .env file.
