import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD-eatKugeQBCj-g0tiIm6S0-apj9pH4ew",
  authDomain: "ticbaj.firebaseapp.com",
  projectId: "ticbaj",
  storageBucket: "ticbaj.firebasestorage.app",
  messagingSenderId: "539304980081",
  appId: "1:539304980081:web:8adf3fd8f5cd92dd0035d0"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)