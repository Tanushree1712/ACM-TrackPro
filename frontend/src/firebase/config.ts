// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvpfx9pfEvPTecItINgKZGXUHV5lei6yY",
  authDomain: "acm-trackpro.firebaseapp.com",
  projectId: "acm-trackpro",
  storageBucket: "acm-trackpro.firebasestorage.app",
  messagingSenderId: "741504544370",
  appId: "1:741504544370:web:95cf8abb8ca34038c25ceb",
  measurementId: "G-H8SNJ2F5SL",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// 📊 Analytics (safe for SSR / Vite)
export const analyticsPromise = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);
