import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMMr__lc9PUhJubyOncS0tX7jdKzE2EGk",
  authDomain: "phase2-gc1.firebaseapp.com",
  projectId: "phase2-gc1",
  storageBucket: "phase2-gc1.firebasestorage.app",
  messagingSenderId: "856835224042",
  appId: "1:856835224042:web:e4e43143fb13b6733d8293",
  measurementId: "G-3684ZTR958"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);