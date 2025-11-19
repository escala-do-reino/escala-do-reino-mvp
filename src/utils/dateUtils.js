    export function getMesPorExtenso(numeroMes) { 
    
        const nomeMeses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ]
        
        const mesExtenso = nomeMeses[numeroMes];
        return mesExtenso;
}

export function formatarData(dataString) {
    const [dia, mes, ano] = dataString.split("/").map(n => parseInt(n, 10));
    if (!dia || !mes || !ano) return null;

    const data = new Date(ano, mes - 1, dia);
    return isNaN(data.getTime()) ? null : data;
}