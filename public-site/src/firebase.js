// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkwbJkSHh5EMFAX9rRRiEsBSBZmh62YKw",
  authDomain: "rmcwebsite-1ad84.firebaseapp.com",
  projectId: "rmcwebsite-1ad84",
  storageBucket: "rmcwebsite-1ad84.firebasestorage.app",
  messagingSenderId: "600479222343",
  appId: "1:600479222343:web:3897dc20f9d6043493ff62",
  measurementId: "G-VZSET8CST7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export default app;
