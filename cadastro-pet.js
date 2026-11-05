// ==========================================
// FUNÇÃO AUXILIAR PARA FORMULÁRIOS
// ==========================================

function configurarEnvio(idFormulario, idMensagem, texto, aoConcluir) {
    const formulario = document.getElementById(idFormulario);

    if (!formulario) return;

    const mensagem = document.getElementById(idMensagem);

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        mensagem.textContent = texto;
        formulario.reset();

        if (aoConcluir) aoConcluir();
    });
}


// ==========================================
// MENU: PÁGINA ATUAL
// ==========================================

const paginaAtual = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".menu a").forEach(function (link) {
    if (link.getAttribute("href") === paginaAtual) {
        link.classList.add("ativo");
        link.setAttribute("aria-current", "page");
    }
});


// ==========================================
// RODAPÉ: ANO AUTOMÁTICO
// ==========================================

const anoAtual = document.getElementById("anoAtual");

if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
}


// ==========================================
// CADASTRO DE PET (animal.html)
// ==========================================

const fotoPet = document.getElementById("foto");
const previewPet = document.getElementById("preview");

function esconderPreview() {
    if (!previewPet) return;

    URL.revokeObjectURL(previewPet.src);
    previewPet.removeAttribute("src");
    previewPet.hidden = true;
}

if (fotoPet) {
    fotoPet.addEventListener("change", function () {
        const arquivo = fotoPet.files[0];

        esconderPreview();

        if (arquivo) {
            previewPet.src = URL.createObjectURL(arquivo);
            previewPet.hidden = false;
        }
    });
}

configurarEnvio(
    "formPet",
    "mensagem",
    "Pet cadastrado com sucesso!",
    esconderPreview
);


// ==========================================
// CADASTRO DE VOLUNTÁRIO (cadastro.html)
// ==========================================

configurarEnvio(
    "form-cadastro",
    "mensagem-cadastro",
    "Cadastro realizado com sucesso! Obrigado por fazer parte da Patinhas do Bem."
);


// ==========================================
// SOLICITAÇÃO DE RESGATE URGENTE (animal.html)
// ==========================================

configurarEnvio(
    "formEmergencia",
    "mensagemEmergencia",
    "Os dados foram preenchidos! Este formulário ainda é demonstrativo e não envia a solicitação à ONG."
);


// ==========================================
// DOAÇÃO: VALOR E PIX (cadastro.html)
// ==========================================

const botoesValor = document.querySelectorAll(".valor-btn");
const valorPersonalizado = document.getElementById("valorPersonalizado");
const botaoPix = document.getElementById("copiarPix");
const mensagemPix = document.getElementById("mensagemPix");

function obterValorDoacao() {
    const botaoSelecionado = document.querySelector(".valor-btn.selecionado");

    const valor = valorPersonalizado.value
        ? Number(valorPersonalizado.value)
        : Number(botaoSelecionado ? botaoSelecionado.dataset.valor : NaN);

    return Number.isFinite(valor) && valor > 0 ? valor : null;
}

if (valorPersonalizado) {
    botoesValor.forEach(function (botao) {
        botao.addEventListener("click", function () {
            botoesValor.forEach(function (item) {
                item.classList.toggle("selecionado", item === botao);
            });

            valorPersonalizado.value = "";
        });
    });

    valorPersonalizado.addEventListener("input", function () {
        botoesValor.forEach(function (botao) {
            botao.classList.remove("selecionado");
        });
    });

    botaoPix.addEventListener("click", async function () {
        const valor = obterValorDoacao();

        if (!valor) {
            mensagemPix.textContent =
                "Por favor, informe um valor válido para sua doação antes de copiar a chave Pix.";
            return;
        }

        const chavePix = document.getElementById("chavePix").textContent.trim();

        try {
            await navigator.clipboard.writeText(chavePix);

            const valorFormatado = valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

            mensagemPix.textContent =
                "Chave Pix copiada com sucesso! Você escolheu doar " + valorFormatado +
                ". Agora abra o aplicativo do seu banco, selecione Pix, cole a chave, " +
                "informe esse valor e confirme o pagamento. Obrigado por ajudar nossos animais!";
        } catch (erro) {
            mensagemPix.textContent =
                "Não foi possível copiar automaticamente. Selecione e copie a chave Pix manualmente.";
        }
    });
}