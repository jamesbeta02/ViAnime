// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZFsy9mzhvETv43VQjPio0hbUbVb4osZU",
  authDomain: "vianime-72223.firebaseapp.com",
  projectId: "vianime-72223",
  storageBucket: "vianime-72223.firebasestorage.app",
  messagingSenderId: "370190096989",
  appId: "1:370190096989:web:176c746cd9bf3ef9164bb4",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
