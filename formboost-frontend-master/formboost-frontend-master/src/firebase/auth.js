import { 
  auth, 
  db 
} from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Helper to check if auth is available
const checkAuth = () => {
  if (!auth) {
    throw new Error('Firebase Auth is not properly initialized');
  }
  return auth;
};

export const signUpWithEmailAndPassword = async (email, password, displayName) => {
  try {
    const authInstance = checkAuth();
    const userCredential = await createUserWithEmailAndPassword(
      authInstance,
      email,
      password
    );
    
    // Update user profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: displayName || '',
      createdAt: new Date().toISOString(),
      photoURL: '',
      role: 'user',
      lastLogin: new Date().toISOString()
    });
    
    // Send email verification
    await sendEmailVerification(userCredential.user);
    
    return userCredential.user;
  } catch (error) {
    console.error('Firebase signup error:', error);
    // Provide more user-friendly error messages
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('This email is already registered. Please login instead.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      case 'auth/weak-password':
        throw new Error('Password should be at least 6 characters.');
      case 'auth/network-request-failed':
        throw new Error('Network error. Please check your internet connection.');
      case 'auth/too-many-requests':
        throw new Error('Too many attempts. Please try again later.');
      default:
        throw new Error(error.message || 'Failed to create account. Please try again.');
    }
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const authInstance = checkAuth();
    const appUrl = import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const actionCodeSettings = appUrl
      ? {
          url: `${appUrl}/login`,
          handleCodeInApp: false,
        }
      : undefined;

    await sendPasswordResetEmail(authInstance, email, actionCodeSettings);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('No account found with this email address.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      case 'auth/too-many-requests':
        throw new Error('Too many attempts. Please try again later.');
      default:
        throw new Error('Failed to send password reset email. Please try again.');
    }
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
