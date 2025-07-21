import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBHBkUFtXQtxatOz85y3ZXnveJHr6wFgM8",
  authDomain: "wasteless-64f24.firebaseapp.com",
  projectId: "wasteless-64f24",
  storageBucket: "wasteless-64f24.appspot.com",  
  messagingSenderId: "627272465069",
  appId: "1:627272465069:web:7f738d966262ab8e9a6424",
  measurementId: "G-7420YTEE4J"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
