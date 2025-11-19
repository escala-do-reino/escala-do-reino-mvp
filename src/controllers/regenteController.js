import { Regente } from "../models/Regente.js";
import { adicionarRegente, listarRegentes, atualizarRegente, removerRegente } from "../services/regenteService.js";

const nomeInput = document.getElementById('nomeRegente');
const listaRegentes = document.getElementById('listaRegentes');

export async function handleAdicionarRegente(event) {
    event.preventDefault();

    const nome = nomeInput.value.trim();
    if (!nome) return alert("Digite o nome do regente!");

    try {
        const novoRegente = new Regente(nome);
        await adicionarRegente(novoRegente)
        nomeInput.value = "";
        carregarRegentes();
    } catch (error) {
        console.error("Erro ao adicionar regente: ", error);
        alert("Não foi possível adicionar o regente.");
    }
}

export async function carregarRegentes() {
    try {
        const regentes = await listarRegentes();
        listaRegentes.innerHTML = "";

        regentes.forEach(regente => {
            const li = document.createElement('li');
            li.className = "flex justify-between items-center border-b py-2";

            li.innerHTML = `
                <span>${regente.nome}</span>
                <div class="flex gap-2">
                    <button class="text-blue-600 hover:underline" data-id="${regente.id}" data-action="editar">✏️</button>
                    <button class="text-red-600 hover:underline" data-id="${regente.id}" data-action="remover">🗑️</button>
                </div>
            `;

            listaRegentes.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar regentes: ", error);
    }
}

export async function handleAtualizarRegente(id, novosDados) {
    try {
        await atualizarRegente(id, novosDados);
        await carregarRegentes();
    } catch (error) {
        console.error("Erro ao atualizar regente: ", error);
        alert("Não foi possível atualizar o regente.");
    }
}

export async function handldeRemoverRegente(id) {
    if (!confirm("Tem certeza que deseja remover este regente?")) return;

    try {
        await removerRegente(id);
        await carregarRegentes();
    } catch (error) {
        console.error("Erro ao remover regente: ", error);  
    }
}

export function inicializarRegenteController() {
    listaRegentes.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;

        if (!id || !action) return;

        if (action === "remover") handldeRemoverRegente(id);
        if (action === "editar") {
            const novoNome = prompt("Novo nome do regente:");
            if (novoNome) handleAtualizarRegente(id, { nome: novoNome });
        }
    });

    carregarRegentes();
}