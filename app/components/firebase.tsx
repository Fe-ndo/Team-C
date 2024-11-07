// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { config } from "../components/config/config";
import { getFirestore } from "firebase/firestore";
// Initialize Firebase
const app = initializeApp(config);
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
