import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAcL1v6VzLIG3DqvV4CKv65gK4Sltp3xKo",
    authDomain: "escala-do-reino.firebaseapp.com",
    projectId: "escala-do-reino",
    storageBucket: "escala-do-reino.firebasestorage.app",
    messagingSenderId: "30835907853",
    appId: "1:30835907853:web:6db1a1ce2ccb0128456444",
    measurementId: "G-4HG87Z44T6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };