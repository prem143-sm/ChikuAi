import { getApp, getApps, initializeApp } from 'firebase/app';

const config = import.meta.env;
const firebaseOptions = {
  apiKey: config.VITE_FIREBASE_API_KEY,
  authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: config.VITE_FIREBASE_PROJECT_ID,
  appId: config.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(firebaseOptions).every(Boolean);
const app = firebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(firebaseOptions))
  : null;

export const firebaseApp = app;

export async function signInWithGoogle() {
  if (!app) throw new Error('Google sign-in is not configured yet. Ask a parent or guardian to finish Firebase setup.');
  const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
}

export async function signOutUser() {
  if (!app) throw new Error('Google sign-in is not configured yet.');
  const { getAuth, signOut } = await import('firebase/auth');
  const auth = getAuth(app);
  return signOut(auth);
}
