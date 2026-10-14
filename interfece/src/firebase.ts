import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDhfUFr8l9PHiHjCEKf05_2MR3drDE4EoA",
    authDomain: "lead-agent-2f64a.firebaseapp.com",
    projectId: "lead-agent-2f64a",
    storageBucket: "lead-agent-2f64a.firebasestorage.app",
    messagingSenderId: "856513165766",
    appId: "1:856513165766:web:ec825550f8aca0bc621ac7",
    measurementId: "G-B1YWGZG7CC"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);