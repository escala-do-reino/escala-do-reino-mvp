export function abrirModal(elementoGatilho, modal) {
    elementoGatilho.addEventListener('click', () => abrirModalAcao(modal));
}

export function fecharModal(elementoGatilho, modal) {
    elementoGatilho.addEventListener('click', () => fecharModalAcao(modal));
}

export function abrirModalAcao(modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

export function fecharModalAcao(modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    // limparCamposModal(modal);
}

function limparCamposModal(modal) {
    const inputs = modal.querySelectorAll('input, checkbox');

    inputs.forEach(input => {
        if (input.type === "checkbox" || input.type === "radio") {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
}