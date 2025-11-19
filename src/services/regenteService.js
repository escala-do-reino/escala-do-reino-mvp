import { db } from "../config/firebaseConfig.js";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const regentesCollection = collection(db, 'regentes');

export async function adicionarRegente(regente) {
    return await addDoc(regentesCollection, regente.toFirestore())
}

export async function listarRegentes() {
    const snapshot = await getDocs(regentesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function atualizarRegente(id, dados) {
    const ref = doc(db, 'regentes', id);
    await updateDoc(ref, dados);
}

export async function removerRegente(id) {
    const ref = doc(db, 'regentes', id);
    await deleteDoc(ref);
}