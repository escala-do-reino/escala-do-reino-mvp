import { db } from "../config/firebaseConfig.js";
import { collection, addDoc, updateDoc, doc, deleteDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getMesPorExtenso } from "../utils/dateUtils.js";
import { listarCultosPorMes } from "./cultoService.js";
import { Escala } from "../models/Escala.js";

const escalasCollection = collection(db, 'escalas');

export async function adicionarEscala(escala) {
    return await addDoc(escalasCollection, escala.toFirestore());
}

export async function listarEscalasPorMes(ano, mes) {
    const q = query(
        escalasCollection, 
        where("ano", "==", ano), 
        where("mes", "==", mes)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function atualizarEscala(id, dados) {
    const ref = doc(db, 'escalas', id);
    await updateDoc(ref, dados);
}

export async function removerEscala(id) {
    const ref = doc(db, 'escalas', id);
    await deleteDoc(ref);
}

export function listarTrimestre() {
    const trimestre = [];
    const trimestrePorExtenso = [];
    const mesAtual = new Date().getMonth();

    trimestre[0] = mesAtual == 0 ? mesAtual + 11 : mesAtual - 1;
    trimestre[1] = mesAtual;
    trimestre[2] = mesAtual == 11 ? mesAtual - 11 : mesAtual + 1;

    trimestre.forEach(trimestre => {
        const trimestreExtenso = getMesPorExtenso(trimestre);
        trimestrePorExtenso.push(trimestreExtenso);
    })    

    return trimestrePorExtenso;
}

export async function carregarEscalaMes(ano, mes) {
    const cultos = await listarCultosPorMes(ano, mes);

    const escala = new Escala(ano, mes);

    cultos.forEach(culto => {
        escala.adicionarCulto(culto);
    });

    return escala;
}

