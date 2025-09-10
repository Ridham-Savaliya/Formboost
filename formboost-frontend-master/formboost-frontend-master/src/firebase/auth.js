// src/firebase/auth.js
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { sendPasswordResetEmail as firebaseSendPasswordResetEmail } from "firebase/auth";

// Helper to check if auth is available
const checkAuth = () => {
  if (!auth) {
    throw new Error('Firebase Auth is not properly initialized');
  }
};

export const signUpWithEmailAndPassword = async (email, password) => {
  try {
    checkAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Firebase signup error:', error.message);
    // Provide more user-friendly error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please login instead.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use a stronger password.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw new Error('Failed to create account. Please try again.');
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    checkAuth();
    const appUrl = import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const actionCodeSettings = appUrl
      ? {
          url: `${appUrl}/login`,
          handleCodeInApp: false,
        }
      : undefined;

    await firebaseSendPasswordResetEmail(auth, email, actionCodeSettings);
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email address');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later.');
    } else if (error.code === 'auth/missing-android-pkg-name' || error.code === 'auth/missing-continue-uri' || error.code === 'auth/invalid-continue-uri') {
      throw new Error('Reset link configuration error. Please try again later.');
    }
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    checkAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Firebase login error:', error.message);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    checkAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    // Add custom parameters to prevent popup issues
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error.message);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    }
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    if (auth && typeof auth.signOut === 'function') {
      await signOut(auth);
    }
  } catch (error) {
    console.error('Sign out error:', error.message);
  }
};

// Get current user token
export const getCurrentUserToken = async () => {
  try {
    if (auth && auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('Get token error:', error.message);
    return null;
  }
};
