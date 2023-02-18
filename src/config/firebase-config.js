import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'; 


const firebaseConfig = {
  apiKey: "AIzaSyBhjEANTvw5mh4qHs2vH-AOzFQo2V9Lyfo",
  authDomain: "trackmyday-2fb3d.firebaseapp.com",
  projectId: "trackmyday-2fb3d",
  storageBucket: "trackmyday-2fb3d.appspot.com",
  messagingSenderId: "228812064448",
  appId: "1:228812064448:web:daea2c629a77378a1c4f25",
  measurementId: "G-6R9FF4VWY3"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);