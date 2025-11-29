import { Timestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

export class Culto {
    constructor(id, nome, data, regentes = []) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.regentes = regentes;
    }

    static fromFirestore(doc) {
    const dados = doc.data();

    let dataCulto = null;

    if (dados.data instanceof Date) {
        // Firestore devolveu um Date diretamente
        dataCulto = dados.data;
    } else if (dados.data && typeof dados.data.toDate === "function") {
        // Firestore devolveu um Timestamp
        dataCulto = dados.data.toDate();
    } else {
        console.warn(`Campo 'data' inválido no documento ${doc.id}:`, dados.data);
    }

    return new Culto(
        doc.id,
        dados.nome ?? "",
        dataCulto,
        Array.isArray(dados.regentes) ? dados.regentes : []
    );
}


    toFirestore() {
        if (!(this.data instanceof Date) || isNaN(this.data.getTime())) {
            throw new Error("Data inválida ao enviar para Firestore");
        }

        return {
            nome: this.nome,
            data: Timestamp.fromDate(this.data),
            regentes: this.regentes,
            ano: this.data.getFullYear(),
            mes: this.data.getMonth() + 1
        };
    }

    static parseDate(data) {
        if (!data) return null;

        // Se já for Date
        if (data instanceof Date) {
            return data;
        }

        // Se vier Timestamp (Firestore)
        if (data.toDate instanceof Function) {
            return data.toDate();
        }

        // Se for string "yyyy-mm-dd" (input HTML)
        if (typeof data === "string" && data.includes("-")) {
            const [ano, mes, dia] = data.split("-");
            return new Date(ano, mes - 1, dia);
        }

        // Se for string "dd/mm/yyyy" (BR)
        if (typeof data === "string" && data.includes("/")) {
            const [dia, mes, ano] = data.split("/");
            return new Date(ano, mes - 1, dia);
        }

        return null;
    }

}
