import { listarTrimestre } from "../services/escalaService.js";

const selectMes = document.getElementById('selectMes');

document.addEventListener('DOMContentLoaded', inicializarEscalaGerenciarController);

export function inicializarEscalaGerenciarController() {
    handleListarTrimestre();
}

function handleListarTrimestre() {
    const trimestre = listarTrimestre();
    console.log(trimestre);

    trimestre.forEach(mes => {
        const option = document.createElement('option');
        option.innerHTML = mes;
        selectMes.appendChild(option);
    });
}