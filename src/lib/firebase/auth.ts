import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { firebaseAuth } from './config';

export function observeAuthState(
  listener: Parameters<typeof onAuthStateChanged>[1],
) {
  return onAuthStateChanged(firebaseAuth, listener);
}

export async function signInWithEmailPassword(email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function registerWithEmailPassword(
  email: string,
  password: string,
) {
  return createUserWithEmailAndPassword(firebaseAuth, email, password);
}

export async function sendVerificationEmail() {
  if (!firebaseAuth.currentUser) {
    throw new Error('We could not prepare email verification right now.');
  }

  return sendEmailVerification(firebaseAuth.currentUser);
}

export async function refreshCurrentUser() {
  if (!firebaseAuth.currentUser) {
    return null;
  }

  await reload(firebaseAuth.currentUser);

  return firebaseAuth.currentUser;
}

export async function sendPasswordRecoveryEmail(email: string) {
  return sendPasswordResetEmail(firebaseAuth, email);
}

export async function signOutCurrentUser() {
  return signOut(firebaseAuth);
}

export function getFriendlyAuthErrorMessage(error: unknown) {
  if (error instanceof Error && !(error instanceof FirebaseError)) {
    return error.message;
  }

  if (!(error instanceof FirebaseError)) {
    return 'Something went wrong. Please try again.';
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Your email or password is incorrect.';
    case 'auth/missing-password':
      return 'Enter your password to continue.';
    case 'auth/weak-password':
      return 'Use a password with at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/missing-email':
      return 'Enter your email address to continue.';
    default:
      return 'Unable to complete authentication right now.';
  }
}
