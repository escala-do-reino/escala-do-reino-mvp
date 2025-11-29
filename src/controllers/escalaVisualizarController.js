import { Culto } from "../models/Culto.js";
import { adicionarCulto, listarCultosPorMes, removerCulto, atualizarCulto } from "../services/cultoService.js";
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
const regentesList = document.getElementById('regentesList');
const btnAddRegente = document.getElementById('btnAddRegente');

const YT_API_KEY = 'AIzaSyAGth8ZRA_JMQxk4uQe6fmWq0f84y25Rgo';

// ============================================================================
// ESTADO GLOBAL
// ============================================================================
let cultoEmEdicaoId = null;
let TODOS_OS_REGENTES = [];
let cultos = [];

// ============================================================================
// INITIALIZAÇÃO
// ============================================================================
document.addEventListener("DOMContentLoaded", inicializarEscalaVisualizarController);

export function inicializarEscalaVisualizarController() {
    configurarListeners();
    carregarDadosIniciais();
}

// ============================================================================
// LISTENERS
// ============================================================================
function configurarListeners() {
    formCulto.addEventListener("submit", salvarCulto);
    listaEscalas.addEventListener("click", handleAcoesDaLista);

    btnNovoCulto.addEventListener("click", abrirModalParaAdicionar);
    btnCancelar.addEventListener("click", () => fecharModalAcao(cultoModal));

    btnAddRegente.addEventListener("click", () => {
        regentesList.appendChild(criarCampoRegente());
    });
}

// ============================================================================
// CARREGAMENTO INICIAL
// ============================================================================
async function carregarDadosIniciais() {
    try {
        await carregarRegentes();
        await carregarEscalas();
    } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        alert("Não foi possível carregar os dados iniciais.");
    }
}

async function carregarRegentes() {
    try {
        const regentes = await listarRegentes();
        TODOS_OS_REGENTES = Array.isArray(regentes) ? regentes : [];
    } catch (err) {
        console.error("Erro ao carregar regentes:", err);
        TODOS_OS_REGENTES = [];
    }
}

async function carregarEscalas() {
    try {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth() + 1;

        spnMesAtual.textContent = getMesPorExtenso(mes - 1);

        cultos = await listarCultosPorMes(ano, mes);
        renderizarListaCultos(cultos);

    } catch (error) {
        console.error("Erro ao carregar cultos:", error);
    }
}

// ============================================================================
// HELPERS YOUTUBE
// ============================================================================
function extrairVideoId(url) {
    if (!url) return null;

    return (
        url.match(/v=([^&]+)/)?.[1] ||
        url.match(/youtu\.be\/([^?&]+)/)?.[1] ||
        url.match(/embed\/([^?&]+)/)?.[1] ||
        url.match(/shorts\/([^?&]+)/)?.[1] ||
        null
    );
}

function gerarThumbnail(url) {
    const id = extrairVideoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

async function buscarTituloYouTube(videoId) {
    try {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YT_API_KEY}`
        );

        const data = await res.json();
        return data.items?.[0]?.snippet?.title ?? "Título não encontrado";

    } catch (e) {
        console.error("Erro ao buscar título:", e);
        return "Erro ao buscar título";
    }
}

// ============================================================================
// RENDERIZAÇÃO DA LISTA DE CULTOS
// ============================================================================
async function renderizarListaCultos(lista) {
    listaEscalas.innerHTML = "";

    for (const c of lista) {
        const li = document.createElement("li");
        li.className =
            "bg-white border rounded-xl p-5 shadow-md hover:shadow-xl transition flex flex-col gap-4";

        const dataFormatada = c.data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short"
        }).toUpperCase();

        const diaSemana = c.data.toLocaleDateString("pt-BR", {
            weekday: "short"
        }).replace(".", "");

        let cardsRegentes = "";

        for (const r of c.regentes) {
            const videoId = extrairVideoId(r.hino);
            const tituloHino = videoId
                ? await buscarTituloYouTube(videoId)
                : "Link inválido";

            const thumb = videoId
                ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                : "";

            cardsRegentes += `
                <div class="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <img src="${thumb}" class="w-24 h-16 object-cover rounded-md shadow-sm"/>
                    <div class="flex flex-col">
                        <span class="font-semibold text-gray-900 text-sm">${r.nome}</span>
                        <span class="text-gray-600 text-xs">${tituloHino}</span>
                        <a href="${r.hino}" target="_blank"
                           class="mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center">
                           Assistir
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="currentColor">
                               <path d="M8 5v14l11-7z" />
                           </svg>
                        </a>
                    </div>
                </div>
            `;
        }

        li.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                    <div class="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-lg p-2 min-w-[60px] shadow-sm">
                        <span class="text-xs font-bold text-gray-400 uppercase">${diaSemana}</span>
                        <span class="text-xl font-bold text-blue-600 leading-none">${dataFormatada.split(" ")[0]}</span>
                    </div>

                    <h3 class="font-bold text-gray-800 text-base leading-tight">${c.nome}</h3>
                </div>

                <div class="flex gap-2">
                    <button data-action="editar" data-id="${c.id}" class="text-blue-600 hover:text-blue-800">
                        ✏️
                    </button>

                    <button data-action="remover" data-id="${c.id}" class="text-red-600 hover:text-red-800">
                        🗑️
                    </button>
                </div>
            </div>

            <div class="flex flex-col gap-3">
                ${cardsRegentes}
            </div>
        `;

        listaEscalas.appendChild(li);
    }
}

// ============================================================================
// AÇÕES NA LISTA (EDITAR / REMOVER)
// ============================================================================
function handleAcoesDaLista(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "editar") handleEditarCulto(id);
    if (action === "remover") handleRemoverCulto(id);
}

async function handleEditarCulto(id) {
    const culto = cultos.find(c => c.id === id);
    if (!culto) return alert("Culto não encontrado!");

    cultoEmEdicaoId = id;
    abrirModalParaEditar(culto);
}

async function handleRemoverCulto(id) {
    if (!confirm("Tem certeza que deseja remover este culto?")) return;

    try {
        await removerCulto(id);
        await carregarEscalas();
    } catch (error) {
        console.error("Erro ao remover culto:", error);
    }
}

// ============================================================================
// MODAL - ADICIONAR / EDITAR
// ============================================================================
async function abrirModalParaAdicionar() {
    cultoEmEdicaoId = null;

    tituloModal.textContent = "Adicionar Novo Culto";
    btnAcaoModal.textContent = "Adicionar";

    limparFormulario();
    regentesList.appendChild(criarCampoRegente());

    abrirModalAcao(cultoModal);
}

function abrirModalParaEditar(culto) {
    tituloModal.textContent = "Editar Culto";
    btnAcaoModal.textContent = "Salvar Alterações";

    cultoNomeInput.value = culto.nome;
    cultoDataInput.value = culto.data.toISOString().split("T")[0];

    regentesList.innerHTML = "";
    culto.regentes.forEach(r => {
        criarCampoRegente({
            idRegente: r.idRegente,
            hino: r.hino
        });
    });

    abrirModalAcao(cultoModal);
}


function limparFormulario() {
    cultoNomeInput.value = "";
    cultoDataInput.value = "";
    regentesList.innerHTML = "";
}

// ============================================================================
// FORMULÁRIO DO MODAL
// ============================================================================
function obterRegentesDoModal() {
    return [...regentesList.querySelectorAll(".regente-card")].map(card => {
        const idRegente = card.querySelector(".regente-select")?.value || "";
        const hino = card.querySelector(".hino-input")?.value.trim() || "";

        const regenteInfo = TODOS_OS_REGENTES.find(r => r.id === idRegente);

        return {
            idRegente,
            nome: regenteInfo ? regenteInfo.nome : "",
            hino,
        };
    }).filter(r => r.idRegente !== "");
}


async function salvarCulto(e) {
    e.preventDefault();

    const nome = cultoNomeInput.value.trim();
    const data = cultoDataInput.value;
    const regentes = obterRegentesDoModal();

    if (!nome || !data || regentes.length === 0)
        return alert("Preencha todos os campos!");

    try {
        const culto = new Culto(
            cultoEmEdicaoId,
            nome,
            Culto.parseDate(data),
            regentes
        );

        if (cultoEmEdicaoId) {
            await atualizarCulto(culto);
            alert("Culto atualizado!");
        } else {
            await adicionarCulto(culto);
            alert("Culto adicionado!");
        }

        fecharModalAcao(cultoModal);
        carregarEscalas();

    } catch (error) {
        console.error("Erro ao salvar culto:", error);
        alert("Erro ao salvar culto.");
    }
}

// ============================================================================
// CAMPOS DE REGENTES
// ============================================================================
function criarCampoRegente(regente = { idRegente: "", hino: "" }) {
    const container = document.createElement("div");
    container.className = "regente-card border p-3 rounded-lg shadow-sm bg-gray-50 flex flex-col gap-2";

    container.innerHTML = `
        <div class="flex flex-col">
            <label class="text-sm font-semibold">Regente:</label>
            <select class="regente-select border rounded p-2"></select>
        </div>

        <div class="flex flex-col">
            <label class="text-sm font-semibold">Hino (URL YouTube):</label>
            <input type="text" class="hino-input border rounded p-2"
                placeholder="Link do hino" value="${regente.hino}">
        </div>
    `;

    // adiciona ao DOM antes de popular
    regentesList.appendChild(container);

    // popula o select com TODOS_OS_REGENTES já carregados do Firestore
    const selectEl = container.querySelector(".regente-select");
    popularSelectRegentes(selectEl, regente.idRegente);

    return container;
}

function popularSelectRegentes(selectEl, idSelecionado = "") {
    selectEl.innerHTML = `<option value="">Selecione um regente</option>`;

    TODOS_OS_REGENTES.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = r.nome;

        if (idSelecionado === r.id) {
            opt.selected = true;
        }

        selectEl.appendChild(opt);
    });
}




