export class Escala {
    constructor(ano, mes) {
        this.ano = ano;
        this.mes = mes;
        this.cultos = [];
    }

    adicionarCulto(culto) {
        this.cultos.push(culto);
    }

    removerCultoPorId(id) {
        this.cultos = this.cultos.filter(c => c.id !== id);
    }

    atualizarCulto(id, novosDados) {
        this.cultos = this.cultos.map(c => 
            c.id === id ? { ...c, ...novosDados } : c
        );
    }

    toFirestore() {
        return {
            culto: this.culto,
            data: this.data,
            regentes: this.regentes,
            mes: this.mes,
            ano: this.ano
        }
    }

    static fromFirestore(doc) {
        return new Escala(
            doc.culto,
            doc.data.toDate ? doc.data.toDate() : new Date(doc.data),
            doc.regentes,
            doc.ano,    
            doc.mes, 
            doc.id
        );
    }
}