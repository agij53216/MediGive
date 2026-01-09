import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your specific Firebase Project Config
// You can find this in the Firebase Console -> Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyBsgO8JDJSYzZz6umEG2le2leh1eUbqDUU",
    authDomain: "medigive-11fb9.firebaseapp.com",
    projectId: "medigive-11fb9",
    storageBucket: "medigive-11fb9.firebasestorage.app",
    messagingSenderId: "827125222778",
    appId: "1:827125222778:web:5128444e2c57276d291ac3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
