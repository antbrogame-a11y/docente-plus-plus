
// js/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLlynKUWbWO1LMIZwVwaOZC0YE01RWzhI",
  authDomain: "docente-plus-plus-577885-d9bd1.firebaseapp.com",
  projectId: "docente-plus-plus-577885-d9bd1",
  storageBucket: "docente-plus-plus-577885-d9bd1.firebasestorage.app",
  messagingSenderId: "840602960075",
  appId: "1:840602960075:web:b4769d8d625ad7600f9b4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
