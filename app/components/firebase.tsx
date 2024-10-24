// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { config } from "../components/config/config";

// Initialize Firebase
const app = initializeApp(config);
const auth = getAuth(app);

export { auth };
