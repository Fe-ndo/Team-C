import { User, Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  Firestore,
} from "firebase/firestore";

export const initUserProfile = async (
  auth: Auth,
  user: User,
  db: Firestore
) => {
  const uid = user.uid;
  const userDoclink = doc(db, "userProfile", uid);
  const userDoc = await getDoc(userDoclink);
  if (!userDoc.exists()) {
    await setDoc(userDoclink, {
      age: null,
      gender: null,
      height: null,
      weight: null,
      fitnessgoals: "",
      currency: 2000,
    });
    await addDoc(collection(userDoclink, "workouts"), {
      date: new Date(),
      duration: 0,
    });

    await addDoc(collection(userDoclink, "calories"), {
      date: new Date(),
      duration: 0,
    });
  }
};
