import { db } from "../config/firebaseConfig.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import { Culto } from "../models/Culto.js";     

const cultoConverter = {
    toFirestore: (culto) => culto.toFirestore(),
    fromFirestore: (snapshot, options) => Culto.fromFirestore(snapshot)
};

const cultosRef = collection(db, "cultos").withConverter(cultoConverter);

export async function listarCultosPorMes(ano, mes) {
    const q = query(
        cultosRef,
        where("ano", "==", ano),
        where("mes", "==", mes),
        orderBy("data", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}

export async function adicionarCulto(culto) {
    const docRef = await addDoc(cultosRef, culto);
    culto.id = docRef.id;
    return culto;
}

export async function atualizarCulto(culto) {
    if (!culto.id) {
        throw new Error("ID do culto é obrigatório para atualização");
    }

    const docRef = doc(cultosRef, culto.id);
    await setDoc(docRef, culto);
    return culto;
}

export async function removerCulto(id) {
    const cultoDoc = doc(db, "cultos", id);
    await deleteDoc(cultoDoc);
}

export async function getCultoById(id) {
    const cultoDoc = doc(cultosRef, id);
    const snapshot = await getDoc(cultoDoc);

    if (!snapshot.exists()) {
        throw new Error("Culto não encontrado");
    }

    return snapshot.data();
}
