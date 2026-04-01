import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkwbJkSHh5EMFAX9rRRiEsBSBZmh62YKw",
  authDomain: "rmcwebsite-1ad84.firebaseapp.com",
  projectId: "rmcwebsite-1ad84",
  storageBucket: "rmcwebsite-1ad84.firebasestorage.app",
  messagingSenderId: "600479222343",
  appId: "1:600479222343:web:3897dc20f9d6043493ff62",
  measurementId: "G-VZSET8CST7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
