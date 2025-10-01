import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDq2xJJHw2g1VhsIAfXwmENdWlJiHmGhpo",
    authDomain: "universitymarketplace-9419c.firebaseapp.com",
    projectId: "universitymarketplace-9419c",
    storageBucket: "universitymarketplace-9419c.firebasestorage.app",
    messagingSenderId: "641055786728",
    appId: "1:641055786728:web:8851949799d95723626b5d",
    measurementId: "G-X2KP9F59RD"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
