// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "myfess-4d181.firebaseapp.com",
    projectId: "myfess-4d181",
    storageBucket: "myfess-4d181.appspot.com",
    messagingSenderId: "174215627831",
    appId: "1:174215627831:web:9c9a7753700281594a2bb2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)