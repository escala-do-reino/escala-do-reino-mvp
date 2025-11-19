export class Regente {
    constructor(nome, ultimaRegencia = null) {
        this.nome = nome;
        this.ultimaRegencia = ultimaRegencia;
    }

    toFirestore() {
        return {
            nome: this.nome,
            ultimaRegencia: this.ultimaRegencia ? this.ultimaRegencia : null
        };
    }

    fromFirestore(data) {
        return new Regente(data.nome, data.ultimaRegencia?.toDate());
    }
}