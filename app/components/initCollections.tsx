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

// export const initUserProfile = async (
//   auth: Auth,
//   user: User,
//   db: Firestore
// ) => {
//   const uid = user.uid;
//   const userDoclink = doc(db, "userProfile", uid);
//   const userDoc = await getDoc(userDoclink);
//   if (!userDoc.exists()) {
//     await setDoc(userDoclink, {
//       age: null,
//       gender: null,
//       height: null,
//       weight: null,
//       fitnessgoals: "",
//       currency: 2000,
//     });
//     await addDoc(collection(userDoclink, "workouts"), {
//       date: new Date(),
//       duration: 0,
//     });

//     await addDoc(collection(userDoclink, "calories"), {
//       date: new Date(),
//       duration: 0,
//     });
//   }
// };

export const initUserProfile = async (
  auth: Auth,
  user: User,
  db: Firestore,
  additionalInfo: {
    firstName?: string;
    lastName?: string;
    age?: string;
    height?: string;
    weight?: string;
  }
) => {
  const {
    firstName = "",
    lastName = "",
    age = null,
    height = null,
    weight = null,
  } = additionalInfo; // Destructure with defaults
  const uid = user.uid;
  const userDoclink = doc(db, "userProfile", uid);
  const userDoc = await getDoc(userDoclink);

  if (!userDoc.exists()) {
    // Initialize user profile with additional fields
    await setDoc(userDoclink, {
      firstName, // Added
      lastName, // Added
      age, // Added
      height, // Added
      weight, // Added
      fitnessGoals: "", // Renamed for clarity
      currency: 2000, // Initial value for user currency
      createdAt: new Date().toISOString(), // Added timestamp
    });

    // Initialize workouts subcollection
    await addDoc(collection(userDoclink, "workouts"), {
      date: new Date(),
      duration: 0,
    });

    // Initialize calories subcollection
    await addDoc(collection(userDoclink, "calorie_entries"), {});
  }
};
