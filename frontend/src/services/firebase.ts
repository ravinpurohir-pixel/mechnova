import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { UserProfile, Language, UserRole } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('MechNova: Firebase successfully initialized.');
  } catch (err) {
    console.warn('MechNova: Firebase init error, falling back to local demo mode:', err);
  }
} else {
  console.log('MechNova: Running in Demo Mode (Local Storage persistence). Configure .env for live Firebase.');
}

export { auth, db, isConfigured };

// Demo & Local Storage Auth Helpers
const STORAGE_USER_KEY = 'mechnova_current_user';
const STORAGE_USERS_DB = 'mechnova_demo_users_db';

export const getSavedLocalUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setSavedLocalUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_USER_KEY);
  }
};

export const AuthService = {
  isLiveFirebase(): boolean {
    return isConfigured && auth !== null;
  },

  async login(email: string, pass: string): Promise<UserProfile> {
    if (isConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const user = cred.user;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || undefined,
        preferredLanguage: 'en',
        role: 'engineer',
        savedCount: 3,
      };
      setSavedLocalUser(profile);
      return profile;
    } else {
      // Demo authentication
      await new Promise(r => setTimeout(r, 600));
      const profile: UserProfile = {
        uid: `demo_${Date.now()}`,
        email,
        displayName: email.split('@')[0].toUpperCase(),
        preferredLanguage: 'en',
        role: 'engineer',
        savedCount: 5,
        organization: 'Industrial Mech Corp'
      };
      setSavedLocalUser(profile);
      return profile;
    }
  },

  async signup(email: string, pass: string, name: string, role: UserRole = 'engineer'): Promise<UserProfile> {
    if (isConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      const profile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName: name,
        preferredLanguage: 'en',
        role,
        savedCount: 0,
      };
      setSavedLocalUser(profile);
      return profile;
    } else {
      await new Promise(r => setTimeout(r, 600));
      const profile: UserProfile = {
        uid: `demo_new_${Date.now()}`,
        email,
        displayName: name,
        preferredLanguage: 'en',
        role,
        savedCount: 0,
        organization: 'Gujarat Technological Institute'
      };
      setSavedLocalUser(profile);
      return profile;
    }
  },

  async loginAsGuest(): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 300));
    const guestUser: UserProfile = {
      uid: 'guest_guest_01',
      email: 'guest@mechnova.local',
      displayName: 'Guest Engineer',
      preferredLanguage: 'en',
      role: 'student',
      organization: 'Engineering Demo Fleet',
      savedCount: 2
    };
    setSavedLocalUser(guestUser);
    return guestUser;
  },

  async logout(): Promise<void> {
    if (isConfigured && auth) {
      await signOut(auth);
    }
    setSavedLocalUser(null);
  },

  async resetPassword(email: string): Promise<void> {
    if (isConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      await new Promise(r => setTimeout(r, 500));
    }
  }
};
