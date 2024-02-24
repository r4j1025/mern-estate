// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-9c140.firebaseapp.com",
  projectId: "mern-estate-9c140",
  storageBucket: "mern-estate-9c140.appspot.com",
  messagingSenderId: "150268101252",
  appId: "1:150268101252:web:c355e016d5f55e2a3d78d1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//this is the default code from firebase sdk