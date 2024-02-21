import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGESENDER,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const initFirebase = () => {
  
  return app
}
const db = getFirestore(app);
const auth = getAuth(app); // Initialize authentication module


export const provider = new GoogleAuthProvider();
export { db  }; // Export authentication module along with db
export {auth};

console.log("Firebase app initialized");


