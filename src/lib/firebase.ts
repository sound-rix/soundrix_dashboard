// ---------------------------------------------------------------------------
// Real Firebase Auth (Email/Password + Google) for Sound-Rix.
// Static-host friendly (cPanel / Netlify / Vercel).
//
// IMPORTANT — Firebase Console setup:
//   1. Authentication → Sign-in method → enable "Email/Password" and "Google".
//   2. Authentication → Settings → Authorized domains → add your production
//      domain (e.g. yourdomain.com) AND any preview domain you use.
//   3. For Google sign-in on cPanel, the OAuth popup needs the live HTTPS
//      domain to be in that list — otherwise you'll see "auth/unauthorized-domain".
// ---------------------------------------------------------------------------

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged as fbOnAuthStateChanged,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  signInWithPopup as fbSignInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  setPersistence,
  browserLocalPersistence,
  type User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBukq0W89PpY6mM90BGIZm8BX7FrRn2oq4",
  authDomain: "sound-rix.firebaseapp.com",
  projectId: "sound-rix",
  storageBucket: "sound-rix.firebasestorage.app",
  messagingSenderId: "522218290713",
  appId: "1:522218290713:web:ce197148c5ed79ab4bb488",
  measurementId: "G-9EDE8WW0QQ"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Persist sessions across reloads (default, but make it explicit).
setPersistence(auth, browserLocalPersistence).catch(() => {
  /* non-fatal: falls back to default persistence */
});

// Handle redirect-based Google sign-in (fallback when popup is blocked).
getRedirectResult(auth).catch(() => {
  /* ignore */
});

export type User = FirebaseUser;

// Friendlier error messages for the UI.
function prettify(err: unknown): Error {
  const code = (err as { code?: string })?.code || "";
  const map: Record<string, string> = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/missing-password": "Please enter your password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect password.",
    "auth/user-not-found": "No account found for this email.",
    "auth/email-already-in-use": "An account already exists for this email.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/popup-blocked": "Popup blocked — retrying with redirect…",
    "auth/unauthorized-domain":
      "This domain isn't authorized in Firebase. Add it under Authentication → Settings → Authorized domains.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
  };
  const msg = map[code] || (err instanceof Error ? err.message : "Authentication failed.");
  return new Error(msg);
}

// Firebase-compatible shims so the rest of the app stays unchanged.
export function onAuthStateChanged(_a: typeof auth, cb: (u: User | null) => void) {
  return fbOnAuthStateChanged(auth, cb);
}

export async function signInWithEmailAndPassword(_a: typeof auth, email: string, password: string) {
  try {
    return await fbSignInWithEmailAndPassword(auth, email.trim(), password);
  } catch (e) {
    throw prettify(e);
  }
}

export async function createUserWithEmailAndPassword(_a: typeof auth, email: string, password: string) {
  try {
    return await fbCreateUserWithEmailAndPassword(auth, email.trim(), password);
  } catch (e) {
    throw prettify(e);
  }
}

export async function signInWithPopup(_a: typeof auth, _provider: unknown) {
  try {
    return await fbSignInWithPopup(auth, googleProvider);
  } catch (e) {
    const code = (e as { code?: string })?.code || "";
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, googleProvider);
      return { user: auth.currentUser } as { user: User | null };
    }
    throw prettify(e);
  }
}

export async function signOut(_a: typeof auth) {
  return fbSignOut(auth);
}

export async function updateProfile(user: User, profile: { displayName?: string; photoURL?: string }) {
  return fbUpdateProfile(user, profile);
}