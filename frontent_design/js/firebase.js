// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8rshzt8PIhgbZ_2cQbUfoKZZzF1e_KZI",
  authDomain: "bakeryance-8f098.firebasestorage.app",
  projectId: "bakeryance-8f098",
  storageBucket: "bakeryance-8f098.appspot.com",
  messagingSenderId: "23374912446",
  appId: "1:23374912446:web:84c4112e9bcae4d81b77ef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase initialized");