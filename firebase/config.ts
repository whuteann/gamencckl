// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getFunctions} from "firebase/functions";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// firebase services export
export const auth = getAuth(firebase_app);
export const firestore = getFirestore(firebase_app);
export const functions = getFunctions(firebase_app, process.env.NEXT_PUBLIC_FIREBASE_REGION);


export const actionCodeSettings = {
  // URL you want to redirect back to after password reset.
  url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  // This must be true for email link sign-in.
  handleCodeInApp: false,
};


