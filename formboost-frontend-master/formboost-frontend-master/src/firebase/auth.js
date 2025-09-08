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

export const signUpWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const sendPasswordResetEmail = (email) => {
  return firebaseSendPasswordResetEmail(auth, email);
};
