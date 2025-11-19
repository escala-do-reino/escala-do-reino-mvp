import { Culto } from "../models/Culto.js";
import { adicionarCulto, getCultoById, listarCultosPorMes, removerCulto, atualizarCulto } from "../services/cultoService.js";
import { listarRegentes } from "../services/regenteService.js";
import { getMesPorExtenso } from "../utils/dateUtils.js";
import { abrirModalAcao, fecharModalAcao } from "../utils/modalUtils.js";

const listaEscalas = document.getElementById('listaEscalas');
const spnMesAtual = document.getElementById('spanMesAtual');
const btnNovoCulto = document.getElementById('btnNovoCulto');
const cultoModal = document.getElementById('cultoModal');
const formCulto = document.getElementById('formCulto');
const btnCancelar = document.getElementById('btnCancelar');
const btnAcaoModal = document.getElementById('btnAcaoModal');
const checkboxRegContainer = document.getElementById('checkboxRegContainer');
const cultoNomeInput = document.getElementById('cultoNome');
const cultoDataInput = document.getElementById('cultoData');
const tituloModal = document.getElementById('tituloModal');

let cultoEmEdicaoId = null;

document.addEventListener('DOMContentLoaded', inicializarEscalaVisualizarController);

export function inicializarEscalaVisualizarController() {
    configurarListeners();
    carregarDadosIniciais();
}

function configurarListeners() {
    formCulto.addEventListener('submit', salvarCulto);
    listaEscalas.addEventListener('click', handleAcoesDaLista);
    btnNovoCulto.addEventListener(`click`, abrirModalParaAdicionar);
    btnCancelar.addEventListener('click', () => fecharModalAcao(cultoModal));
}

async function carregarDadosIniciais() {
    try {
        await carregarRegentes();
        await carregarEscalas();
    } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        alert("Não foi possível carregar os dados iniciais.");
    }
}

async function carregarEscalas() {
    try {
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth() + 1;

        spnMesAtual.textContent = getMesPorExtenso(mesAtual - 1);
        const cultos = await listarCultosPorMes(anoAtual, mesAtual);

        renderizarListaCultos(cultos);
    } catch (error) {
        console.error("Erro ao carregar escalas:", error);
    }
}

async function carregarRegentes() {
    const regentes = await listarRegentes();
    checkboxRegContainer.innerHTML = '';

    for (const r of regentes) {
        checkboxRegContainer.innerHTML += `
            <div class="flex gap-2">
                <input type="checkbox" id="${r.id}" value="${r.nome}" />
                <label for="${r.id}">${r.nome}</label>
            </div>
        `;
    }
}

function renderizarListaCultos(cultos) {
    listaEscalas.innerHTML = "";

    cultos.forEach(c => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center border-b py-2";

        const dataFormatada = c.data.toLocaleDateString("pt-BR");

        li.innerHTML = `
            <div>
                <strong>${c.nome}</strong> - ${c.data.toLocaleDateString("pt-BR")}<br>
                <small>${c.regentes.length > 1 ? "Regentes: " + c.regentes.join(", ") : "Regente: " + c.regentes}</small>
            </div>
            <div class="flex gap-2">
                <button class="text-blue-600 hover:cursor-pointer" data-action="editar" data-id="${c.id}">✏️</button>
                <button class="text-red-600 hover:cursor-pointer" data-action="remover" data-id="${c.id}">🗑️</button>
            </div>
        `;

        listaEscalas.appendChild(li);
    });
}

function handleAcoesDaLista(e) {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;

    if (!action || !id) return;

    if (action === "editar") return abrirModalParaEditar(id);
    if (action === "remover") return handleRemoverCulto(id);
}

function abrirModalParaAdicionar() {
    cultoEmEdicaoId = null;
    tituloModal.textContent = "Adicionar Novo Culto";
    btnAcaoModal.textContent = "Adicionar Culto";

    limparFormulario();
    abrirModalAcao(cultoModal);
}

async function abrirModalParaEditar(id) {
    cultoEmEdicaoId = id;

    tituloModal.textContent = "Editar Culto";
    btnAcaoModal.textContent = "Salvar Alterações";

    limparFormulario();
    
    const culto = await getCultoById(id);
    preencherFormulario(culto);

    abrirModalAcao(cultoModal);
}

function limparFormulario() {
    formCulto.reset();
    checkboxRegContainer.querySelectorAll("input").forEach(c => (c.checked = false));
}

function preencherFormulario(culto) {
    cultoNomeInput.value = culto.nome;
    cultoDataInput.value = culto.data.toISOString().split('T')[0];

    culto.regentes.forEach(regente => {
        const checkbox = checkboxRegContainer.querySelector(`input[value="${regente}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

function obterRegentesSelecionados() {
    return [...checkboxRegContainer.querySelectorAll("input:checked")].map(checkbox => checkbox.value);
}

async function salvarCulto(e) {
    e.preventDefault();

    const nome = cultoNomeInput.value.trim();
    const data = cultoDataInput.value;
    const regentes = obterRegentesSelecionados();
    
    if (!nome || !data || regentes.length === 0) 
        return alert("Preencha todos os campos da escala!");

    try {
        const culto = new Culto(
            cultoEmEdicaoId,
            nome,
            Culto.parseDate(data),
            regentes
        );

        if (cultoEmEdicaoId) {
            await atualizarCulto(culto);
            alert("Culto atualizado com sucesso!");
        } else {
            await adicionarCulto(culto);
            alert("Culto adicionado com sucesso!");
        }

        fecharModalAcao(cultoModal);
        carregarEscalas();
    } catch (error) {
        console.error("Erro ao salvar culto:", error);
        alert("Não foi possível salvar o culto.");
    }
}

async function handleRemoverCulto(id) {
    if (!confirm("Tem certeza que deseja remover este culto?")) return;

    try {
        await removerCulto(id);
        carregarEscalas();
    } catch (error) {
        console.error("Erro ao remover culto:", error);
    }
}

