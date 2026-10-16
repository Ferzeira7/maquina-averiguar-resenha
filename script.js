
const startButton = document.querySelector("#start-button");
const soundButton = document.querySelector("#sound-button");

const statusText = document.querySelector("#status");
const verdictTitle = document.querySelector("#verdict");
const description = document.querySelector("#description");
const percentText = document.querySelector("#percent");
const meterFill = document.querySelector("#meter-fill");
const machineMessage = document.querySelector("#machine-message");
const resenhaImage = document.querySelector("#resenha-image");

// Áudios organizados do menor para o maior nível de resenha.
const audios = {
    baixa: new Audio("audios/musica-de-ninar.mp3"),
    media: new Audio("audios/acorda-caze.mp3"),
    alta: new Audio("audios/bandido-que-67-resenha.mp3"),
    absurda: new Audio("audios/sirene-alarme-bom-para-acordar.mp3")
};

Object.values(audios).forEach(audio => {
    audio.preload = "auto";
    audio.volume = 0.85;
});

let somAtivado = true;
let audioAtual = null;

const verdicts = [
    {
        title: "RESENHA<br>CONFIRMADA",
        description: "A situação ultrapassou o limite do bom senso. Chame uma testemunha e esconda os documentos.",
        min: 81,
        max: 100
    },
    {
        title: "RESENHA<br>ABSURDA",
        description: "Detectamos 3 kg de palhaçada por metro quadrado. A ciência pediu demissão.",
        min: 81,
        max: 100
    },
    {
        title: "POSSÍVEL<br>RESENHA",
        description: "Há indícios fortes, porém o suspeito disse 'confia' e saiu correndo.",
        min: 21,
        max: 50
    },
    {
        title: "RESENHA<br>EM ANÁLISE",
        description: "A máquina está pensando. Não pressione o operador: ele também não sabe.",
        min: 21,
        max: 50
    },
    {
        title: "NENHUMA<br>RESENHA",
        description: "Por incrível que pareça, parece tudo normal. Isso é extremamente suspeito.",
        min: 0,
        max: 20
    },
    {
        title: "RESENHA<br>INTERDIMENSIONAL",
        description: "O acontecimento violou 4 leis da física e uma regra do grupo do WhatsApp.",
        min: 81,
        max: 100
    },
    {
        title: "DEU RUIM<br>NO SISTEMA",
        description: "O computador encontrou uma resenha tão grande que esqueceu a própria senha.",
        min: 51,
        max: 100
    },
    {
        title: "CHAMA O<br>RESPONSÁVEL",
        description: "A máquina recomenda que você finja que nunca esteve aqui.",
        min: 51,
        max: 95
    }
];

const scanMessages = [
    "Inicializando o detector de caô...",
    "Consultando o departamento de fofoca...",
    "Medindo a concentração de bagunça...",
    "Verificando os arquivos confidenciais do grupo...",
    "Perguntando para uma entidade especializada...",
    "Calibrando o resenhômetro..."
];

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// Para qualquer áudio que esteja tocando.
function pararAudio() {
    Object.values(audios).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    audioAtual = null;
}

// Seleciona a imagem de acordo com o percentual.
function atualizarImagem(nivel) {
    let imagem;

    if (nivel <= 20) {
        imagem = "imagens/resenha-baixa.jpg";
    } else if (nivel <= 50) {
        imagem = "imagens/resenha-media.gif";
    } else if (nivel <= 80) {
        imagem = "imagens/resenha-alta.gif";
    } else {
        imagem = "imagens/resenha-absurda.gif";
    }

    if (resenhaImage.getAttribute("src") !== imagem) {
        resenhaImage.src = imagem;
    }
}

// Escolhe e toca a trilha sonora do resultado.
function tocarAudioResenha(nivel) {
    pararAudio();

    if (!somAtivado) return;

    if (nivel <= 20) {
        audioAtual = audios.baixa;
    } else if (nivel <= 50) {
        audioAtual = audios.media;
    } else if (nivel <= 80) {
        audioAtual = audios.alta;
    } else {
        audioAtual = audios.absurda;
    }

    audioAtual.currentTime = 0;

    audioAtual.play().catch(error => {
        console.warn(
            "Não foi possível reproduzir o áudio:",
            error
        );

        machineMessage.textContent =
            "Áudio bloqueado pelo navegador. Clique novamente para tentar.";
    });
}

function runAnalysis() {
    if (startButton.disabled) return;

    startButton.disabled = true;

    // Interrompe a música anterior e limpa o modo de loucura.
    pararAudio();
    document.body.classList.remove("loucura-total");
    document.body.classList.add("scanning");

    statusText.textContent = "ANÁLISE EM ANDAMENTO";
    verdictTitle.innerHTML = "AVERIGUANDO...";

    description.textContent =
        "Não desligue a máquina. Ou desligue. Ela não tem garantia.";

    percentText.textContent = "...%";
    meterFill.style.width = "0%";

    machineMessage.textContent = pickRandom(scanMessages);

    let progress = 0;

    const progressTimer = setInterval(() => {
        progress = Math.min(
            progress + Math.floor(Math.random() * 17) + 8,
            94
        );

        meterFill.style.width = `${progress}%`;
        percentText.textContent = `${progress}%`;
        machineMessage.textContent = pickRandom(scanMessages);
    }, 160);

    setTimeout(() => {
        clearInterval(progressTimer);

        const result = pickRandom(verdicts);

        const score = Math.floor(
            Math.random() * (result.max - result.min + 1)
        ) + result.min;

        meterFill.style.width = `${score}%`;
        percentText.textContent = `${score}%`;

        verdictTitle.innerHTML = result.title;
        description.textContent = result.description;

        atualizarImagem(score);

        document.body.classList.remove("scanning");

        if (score >= 81) {
            document.body.classList.add("loucura-total");

            statusText.textContent = "🚨 ALERTA DE RESENHA 🚨";

            machineMessage.textContent =
                "🚨 RESENHA ABSURDA DETECTADA. DEUS ABANDONOU O SISTEMA. 🚨";
        } else {
            document.body.classList.remove("loucura-total");

            statusText.textContent = "VEREDITO EMITIDO";

            machineMessage.textContent = pickRandom([
                "A máquina falou. Não questione a máquina.",
                "Averiguação concluída. A dignidade não foi encontrada.",
                "Relatório salvo em lugar nenhum.",
                "Obrigado por utilizar tecnologia duvidosa.",
                "Você pode sair, mas a resenha vai junto."
            ]);
        }

        // Toca a música correspondente ao percentual sorteado.
        tocarAudioResenha(score);

        startButton.disabled = false;

    }, 2300);
}

startButton.addEventListener("click", runAnalysis);

// Liga ou desliga as trilhas sonoras.
soundButton.textContent = "🔊 SOM: LIGADO";
soundButton.setAttribute("aria-pressed", "true");

soundButton.addEventListener("click", () => {
    somAtivado = !somAtivado;

    soundButton.textContent = somAtivado
        ? "🔊 SOM: LIGADO"
        : "🔇 SOM: DESLIGADO";

    soundButton.setAttribute(
        "aria-pressed",
        String(somAtivado)
    );

    if (!somAtivado) {
        pararAudio();
    }
});
