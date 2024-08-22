// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADpZ43mMv2B7u6n3oq6ASqs2HJWvZebPk",
  authDomain: "superblisher.firebaseapp.com",
  projectId: "superblisher",
  storageBucket: "superblisher.appspot.com",
  messagingSenderId: "599527726972",
  appId: "1:599527726972:web:1508bb5a963fd998718ef9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { db, auth, storage };
