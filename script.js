
const resultados = [
  {
    nome: "RESENHA CONFIRMADA",
    min: 81,
    max: 100,
    descricao: "A máquina confirmou. Não questione a ciência.",
  },
  {
    nome: "RESENHA ABSURDA",
    min: 81,
    max: 100,
    descricao: "O nível de resenha ultrapassou todos os limites conhecidos.",
  },
  {
    nome: "POSSÍVEL RESENHA",
    min: 21,
    max: 50,
    descricao: "Existem indícios, mas precisamos investigar.",
  },
  {
    nome: "RESENHA EM ANÁLISE",
    min: 21,
    max: 50,
    descricao: "A máquina está tentando entender o que acabou de acontecer.",
  },
  {
    nome: "NENHUMA RESENHA",
    min: 0,
    max: 20,
    descricao: "Infelizmente, não encontramos resenha suficiente.",
  },
  {
    nome: "RESENHA INTERDIMENSIONAL",
    min: 81,
    max: 100,
    descricao: "Isso veio de outra dimensão. Desligue o computador.",
  },
  {
    nome: "DEU RUIM NO SISTEMA",
    min: 51,
    max: 100,
    descricao: "Os circuitos não estavam preparados para isso.",
  },
  {
    nome: "CHAMA O RESPONSÁVEL",
    min: 51,
    max: 95,
    descricao: "Ninguém sabe o que aconteceu. Chame alguém.",
  },
];

const audios = {
  baixa: new Audio("./audios/musica-de-ninar.mp3"),
  media: new Audio("./audios/acorda-caze.mp3"),
  alta: new Audio("./audios/bandido-que-67-resenha.mp3"),
  absurda: new Audio("./audios/sirene-alarme-bom-para-acordar.mp3"),
};

Object.values(audios).forEach((audio) => {
  audio.preload = "auto";
  audio.volume = 0.85;
});

let somAtivado = true;
let audioAtual = null;
let analisando = false;

const elemento = (id) => document.getElementById(id);

function atualizarImagem(nivel) {
  const imagem = elemento("resenha-image");

  if (!imagem) return;

  if (nivel <= 20) {
    imagem.src = "./Imagens/resenha-baixa.jpg";
  } else if (nivel <= 50) {
    imagem.src = "./Imagens/resenha-media.gif";
  } else if (nivel <= 80) {
    imagem.src = "./Imagens/resenha-alta.gif";
  } else {
    imagem.src = "./Imagens/resenha-absurda.gif";
  }

  imagem.onerror = () => {
    console.error("Erro ao carregar imagem:", imagem.src);
    imagem.alt = "Imagem não encontrada. Confira a pasta Imagens.";
  };

  imagem.alt = "Resultado da máquina de averiguar resenha";
}

function pararAudios() {
  Object.values(audios).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  audioAtual = null;
}

function tocarAudioResenha(nivel) {
  pararAudios();

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

  audioAtual.play().catch((erro) => {
    console.warn("Não foi possível reproduzir o áudio:", erro);
  });
}

function alternarSom() {
  somAtivado = !somAtivado;

  const botaoSom = elemento("sound-button");

  if (botaoSom) {
    botaoSom.textContent = somAtivado
      ? "🔊 SOM: LIGADO"
      : "🔇 SOM: DESLIGADO";
  }

  if (!somAtivado) {
    pararAudios();
  }
}

function escolherResultado(nivel) {
  const possiveis = resultados.filter(
    (resultado) =>
      nivel >= resultado.min && nivel <= resultado.max
  );

  return possiveis[
    Math.floor(Math.random() * possiveis.length)
  ];
}

function atualizarInterface(nivel, resultado) {
  const status = elemento("status");
  const veredito = elemento("verdict");
  const descricao = elemento("description");
  const porcentagem = elemento("percent");
  const barra = elemento("meter-fill");
  const mensagem = elemento("machine-message");

  if (status) status.textContent = "ANÁLISE CONCLUÍDA";
  if (veredito) veredito.textContent = resultado.nome;
  if (descricao) descricao.textContent = resultado.descricao;
  if (porcentagem) porcentagem.textContent = `${nivel}%`;

  if (barra) {
    barra.style.width = `${nivel}%`;
  }

  if (mensagem) {
    mensagem.textContent =
      nivel >= 81
        ? "🚨 RESENHA ABSURDA DETECTADA. DEUS ABANDONOU O SISTEMA. 🚨"
        : "Análise finalizada. A máquina está sob controle... por enquanto.";
  }

  document.body.classList.toggle("loucura-total", nivel >= 81);

  atualizarImagem(nivel);
  tocarAudioResenha(nivel);
}

function averiguarResenha() {
  if (analisando) return;

  analisando = true;

  const botao = elemento("start-button");
  const status = elemento("status");
  const veredito = elemento("verdict");
  const descricao = elemento("description");
  const porcentagem = elemento("percent");
  const barra = elemento("meter-fill");
  const mensagem = elemento("machine-message");

  if (botao) {
    botao.disabled = true;
    botao.textContent = "ANALISANDO...";
  }

  pararAudios();
  document.body.classList.remove("loucura-total");

  if (status) status.textContent = "PROCESSANDO DADOS...";
  if (veredito) veredito.textContent = "AGUARDE...";
  if (descricao) {
    descricao.textContent = "A máquina está investigando a resenha...";
  }
  if (porcentagem) porcentagem.textContent = "???%";
  if (barra) barra.style.width = "0%";
  if (mensagem) mensagem.textContent = "NÃO DESLIGUE O EQUIPAMENTO.";

  // O navegador precisa de uma interação do usuário para liberar áudio.
  if (somAtivado) {
    const audioDesbloqueio = audios.baixa;
    audioDesbloqueio.play()
      .then(() => {
        audioDesbloqueio.pause();
        audioDesbloqueio.currentTime = 0;
      })
      .catch(() => {});
  }

  const nivel = Math.floor(Math.random() * 101);

  window.setTimeout(() => {
    const resultado = escolherResultado(nivel);
    atualizarInterface(nivel, resultado);

    if (botao) {
      botao.disabled = false;
      botao.textContent = "AVERIGUAR NOVAMENTE";
    }

    analisando = false;
  }, 2300);
}

function inicializarMaquina() {
  const botao = elemento("start-button");
  const botaoSom = elemento("sound-button");

  if (botao) {
    botao.addEventListener("click", averiguarResenha);
  }

  if (botaoSom) {
    botaoSom.textContent = "🔊 SOM: LIGADO";
    botaoSom.addEventListener("click", alternarSom);
  }

  const status = elemento("status");
  const veredito = elemento("verdict");
  const descricao = elemento("description");
  const porcentagem = elemento("percent");
  const barra = elemento("meter-fill");

  if (status) status.textContent = "SISTEMA PRONTO";
  if (veredito) veredito.textContent = "AGUARDANDO ANÁLISE";
  if (descricao) {
    descricao.textContent =
      "Clique no botão para descobrir o nível de resenha.";
  }
  if (porcentagem) porcentagem.textContent = "0%";
  if (barra) barra.style.width = "0%";

  atualizarImagem(0);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarMaquina);
} else {
  inicializarMaquina();
}
