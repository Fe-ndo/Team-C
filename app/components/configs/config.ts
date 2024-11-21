import { initializeApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Optional, if using Firestore

// Firebase configuration using environment variables
export const firebaseConfig = {
  apiKey: "AIzaSyB6JPDSAlF08e6FC3ej11JV6rL3jBvI99A",
  authDomain: "fittrackr-csci150.firebaseapp.com",
  projectId: "fittrackr-csci150",
  storageBucket: "fittrackr-csci150.appspot.com",
  messagingSenderId: "751651431702",
  appId: "1:751651431702:web:c15ea6895932fdbd7c1c37",
  measurementId: "G-627RMEHYH6",
  databaseURL: "https://fittrackr-csci150-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services exports
export const auth = getAuth(app);
export const firestore = getFirestore(app); // Firestore database

export default app;
