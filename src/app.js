import { signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { auth } from "./config/firebaseConfig.js";

signInAnonymously(auth).catch(console.error);

onAuthStateChanged(auth, (user) => {
    if (!user) return;
    console.log('Usuário UID: ', user.uid);
});
        
