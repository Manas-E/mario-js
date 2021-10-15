
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs } from 'firebase/firestore';
import { addDoc, collection } from "firebase/firestore"; 
import { doc, setDoc,getDoc,updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpyXXfX-9XR1RpFvR2C60_wSnoskq5as0",
  authDomain: "mario-8f490.firebaseapp.com",
  projectId: "mario-8f490",
  storageBucket: "mario-8f490.appspot.com",
  messagingSenderId: "767872370555",
  appId: "1:767872370555:web:72ba481cb8379ad33cdfde",
  measurementId: "G-8RKTD9WZS7"
};

// Initialize Firebase

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  


export {db,addDoc,collection,doc,setDoc,getDoc,updateDoc, arrayUnion, arrayRemove };
  