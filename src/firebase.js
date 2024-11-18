// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXQ39bBwFqfj-YsDjTI4-ffn9-88c-vV8",
  authDomain: "to-do-firebase-f7bf1.firebaseapp.com",
  projectId: "to-do-firebase-f7bf1",
  storageBucket: "to-do-firebase-f7bf1.firebasestorage.app",
  messagingSenderId: "669622482170",
  appId: "1:669622482170:web:98642ed930433284040543"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)