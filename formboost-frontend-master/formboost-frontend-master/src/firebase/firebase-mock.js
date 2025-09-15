// Mock Firebase module for build compatibility
// This allows the app to build successfully while Firebase is being configured

export const auth = {
  currentUser: null,
  onAuthStateChanged: () => {},
  signOut: () => Promise.resolve(),
};

export const initializeApp = () => ({});
export const getApps = () => [];
export const getApp = () => ({});
export const getAuth = () => auth;

// Mock auth functions
export const createUserWithEmailAndPassword = () => Promise.resolve({ user: null });
export const signInWithEmailAndPassword = () => Promise.resolve({ user: null });
export const signInWithPopup = () => Promise.resolve({ user: null });
export const GoogleAuthProvider = function() {};
export const sendPasswordResetEmail = () => Promise.resolve();
export const EmailAuthProvider = {
  credential: () => ({})
};
export const linkWithCredential = () => Promise.resolve();
export const updatePassword = () => Promise.resolve();

// Default export
export default {
  auth,
  initializeApp,
  getApps,
  getApp,
  getAuth
};
