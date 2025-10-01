// Firebase Configuration Template
// Replace the values below with your actual Firebase project configuration

const firebaseConfig = {
    // Your Firebase project configuration
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Stripe Configuration Template
// Replace with your actual Stripe publishable key
const stripeConfig = {
    publishableKey: "pk_test_your_stripe_public_key_here"
};

// Instructions:
// 1. Copy this file to firebase-config.js
// 2. Replace all placeholder values with your actual Firebase configuration
// 3. Update the script.js file to import from firebase-config.js instead of having inline config
// 4. Make sure to add firebase-config.js to your .gitignore file to keep your keys secure

// Example usage in script.js:
// import { firebaseConfig, stripeConfig } from './firebase-config.js';
// firebase.initializeApp(firebaseConfig);
// const stripe = Stripe(stripeConfig.publishableKey);
