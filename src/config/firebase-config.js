import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'; 


const firebaseConfig = {
  apiKey: process.end.REACT_TRACKMYDAY_APIKEY,
  authDomain: process.env.REACT_TRACKMYDAY_AUTHDOMAIN,
  projectId: process.env.REACT_TRACKMYDAY_PROJECTID,
  storageBucket: process.env.REACT_TRACKMYDAY_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_TRACKMYDAY_MESSAGINGSENDERID,
  appId: process.env.REACT_TRACKMYDAY_APPID,
  measurementId: process.env.REACT_TRACKMYDAY_MEASUREMENTID
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);