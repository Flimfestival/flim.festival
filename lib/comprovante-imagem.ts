/*
 * Comprovante de inscrição em imagem (PNG), para a pessoa baixar ou salvar na galeria do celular.
 * Desenhado num canvas, só no navegador: não depende da impressão, que muitos celulares e os
 * navegadores de aplicativos (Instagram, Facebook) não oferecem.
 */
import { evento } from "./evento";
import { categoriaRedacao, type Valores } from "./inscricao";
import { atividadesInscricao } from "./programacao";

type DadosComprovante = {
  campos: [rotulo: string, valor: string][];
  atividades: { titulo: string; quando: string }[];
  orientacoes: string[];
};

// Fonte do sistema (Helvetica no iPhone, Roboto no Android, Arial no computador): tem negrito em todos
// os navegadores. A Manrope do site sai sempre no peso normal no canvas do Safari.
const FONTE = "Helvetica, Arial, sans-serif";

const LARGURA = 1080;
const MARGEM = 84;
const cores = {
  azul: "#104990",
  tinta: "#14213d",
  cinza: "#5a6275",
  linha: "#ece4dc",
  creme: "#fff4f2",
  verde: "#4a7419",
  // Faixas do topo e do rodapé, nas cores das letras do logo.
  faixa: ["#104990", "#fbbf12", "#fe2900", "#517f1c"],
};

// Mesmas informações do comprovante exibido na tela.
export function dadosDoComprovante(inscricao: Valores): DadosComprovante {
  const visitante = inscricao.perfil === "visitante";
  const campos: [string, string][] = [
    [visitante ? "Visitante" : "Estudante", inscricao.nome],
    ["Data de nascimento", inscricao.dataNascimento.split("-").reverse().join("/")],
  ];
  if (!visitante) {
    campos.push(["Escola", inscricao.escola], ["Ano escolar", inscricao.anoEscolar]);
  }
  if (inscricao.responsavelNome) campos.push(["Responsável legal", inscricao.responsavelNome]);

  const categoria = categoriaRedacao(inscricao.anoEscolar);
  const orientacoes = ["Na entrada de cada atividade, diga o nome completo do participante à comissão."];
  if (inscricao.atividades.includes("abertura")) orientacoes.push("Na abertura, leve 2 kg de alimentos.");
  if (inscricao.atividades.includes("concurso-redacao") && categoria) {
    orientacoes.push(
      `Concurso de redação: categoria ${categoria}. O cortejo das 8h, saindo da Igreja do Rosário, é obrigatório. Leve caneta azul ou preta de corpo transparente.`,
    );
  }
  orientacoes.push("Termo de consentimento, participação e uso de imagem e voz: aceito.");

  return {
    campos,
    atividades: atividadesInscricao
      .filter((atividade) => inscricao.atividades.includes(atividade.id))
      .map((atividade) => ({ titulo: atividade.titulo, quando: `${atividade.grupo} · ${atividade.quando}` })),
    orientacoes,
  };
}

// Nome do arquivo baixado: "comprovante-flim-maria-clara-souza.png".
export function nomeDoArquivo(nome: string) {
  const simples = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
  return `comprovante-flim${simples ? `-${simples}` : ""}.png`;
}

export async function gerarComprovante(dados: DadosComprovante): Promise<Blob> {
  const logo = await comLimite(carregarImagem("/assets/logo-comprovante.png")).catch(() => undefined);

  // Primeiro mede a altura total; depois desenha num canvas desse tamanho.
  const medidor = document.createElement("canvas").getContext("2d");
  if (!medidor) throw new Error("Canvas indisponível neste navegador.");
  const altura = desenhar(medidor, dados, FONTE, logo, false);

  const canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = Math.ceil(altura);
  const contexto = canvas.getContext("2d");
  if (!contexto) throw new Error("Canvas indisponível neste navegador.");
  desenhar(contexto, dados, FONTE, logo, true);

  return new Promise((resolver, rejeitar) =>
    canvas.toBlob((blob) => (blob ? resolver(blob) : rejeitar(new Error("Falha ao gerar a imagem."))), "image/png"),
  );
}

// Espera no máximo 3 segundos (um logo lento não impede o comprovante).
function comLimite<T>(promessa: Promise<T>): Promise<T | undefined> {
  return Promise.race([promessa, new Promise<undefined>((resolver) => setTimeout(resolver, 3000))]);
}

function carregarImagem(endereco: string) {
  return new Promise<HTMLImageElement>((resolver, rejeitar) => {
    const imagem = new Image();
    imagem.onload = () => resolver(imagem);
    imagem.onerror = rejeitar;
    imagem.src = endereco;
  });
}

// Quebra o texto em linhas que cabem na largura.
function quebrar(contexto: CanvasRenderingContext2D, texto: string, largura: number) {
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of texto.split(/\s+/).filter(Boolean)) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (!atual || contexto.measureText(tentativa).width <= largura) {
      atual = tentativa;
    } else {
      linhas.push(atual);
      atual = palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

// Desenha o comprovante (ou só mede, com `pintar` falso) e devolve a altura usada.
function desenhar(
  contexto: CanvasRenderingContext2D,
  dados: DadosComprovante,
  familia: string,
  logo: HTMLImageElement | undefined,
  pintar: boolean,
) {
  contexto.textBaseline = "top";
  const conteudo = LARGURA - 2 * MARGEM;

  // Escreve um parágrafo a partir de (x, y) e devolve o y logo abaixo da última linha.
  const escrever = (
    texto: string,
    x: number,
    y: number,
    { peso = 400, tamanho = 30, cor = cores.tinta, largura = LARGURA - MARGEM - x, entrelinha = 1.4 } = {},
    desenharAgora = pintar,
  ) => {
    contexto.font = `${peso} ${tamanho}px ${familia}`;
    for (const linha of quebrar(contexto, texto, largura)) {
      if (desenharAgora) {
        contexto.fillStyle = cor;
        contexto.fillText(linha, x, y);
      }
      y += Math.round(tamanho * entrelinha);
    }
    return y;
  };

  const faixa = (y: number) => {
    if (pintar) {
      const parte = LARGURA / cores.faixa.length;
      cores.faixa.forEach((cor, i) => {
        contexto.fillStyle = cor;
        contexto.fillRect(Math.floor(i * parte), y, Math.ceil(parte), 16);
      });
    }
    return y + 16;
  };

  if (pintar) {
    contexto.fillStyle = "#ffffff";
    contexto.fillRect(0, 0, contexto.canvas.width, contexto.canvas.height);
  }

  let y = faixa(0) + 60;
  if (logo) {
    const altura = 150;
    if (pintar) contexto.drawImage(logo, MARGEM, y, (altura * logo.width) / logo.height, altura);
    y += altura + 28;
  } else {
    y = escrever("FLIM · Festival Literário de Martins", MARGEM, y, { peso: 800, tamanho: 44, cor: cores.azul }) + 8;
  }
  y = escrever(`${evento.data} de ${evento.inicio.slice(0, 4)} · ${evento.local}`, MARGEM, y, {
    tamanho: 28,
    cor: cores.cinza,
  });

  y += 36;
  if (pintar) {
    contexto.fillStyle = cores.linha;
    contexto.fillRect(MARGEM, y, conteudo, 2);
  }
  y += 46;

  y = escrever("COMPROVANTE DE INSCRIÇÃO", MARGEM, y, { peso: 800, tamanho: 24, cor: cores.verde }) + 6;
  y = escrever("Inscrição confirmada", MARGEM, y, { peso: 800, tamanho: 56, entrelinha: 1.2 }) + 30;

  for (const [rotulo, valor] of dados.campos) {
    y = escrever(rotulo, MARGEM, y, { peso: 700, tamanho: 24, cor: cores.cinza }) + 2;
    y = escrever(valor, MARGEM, y, { peso: 600, tamanho: 34, entrelinha: 1.3 }) + 22;
  }

  y += 12;
  y = escrever("Atividades", MARGEM, y, { peso: 800, tamanho: 34, cor: cores.azul }) + 14;
  for (const atividade of dados.atividades) {
    if (pintar) {
      contexto.fillStyle = cores.azul;
      contexto.beginPath();
      contexto.arc(MARGEM + 8, y + 22, 7, 0, Math.PI * 2);
      contexto.fill();
    }
    y = escrever(atividade.titulo, MARGEM + 32, y, { peso: 700, tamanho: 30, entrelinha: 1.35 }) + 2;
    y = escrever(atividade.quando, MARGEM + 32, y, { tamanho: 26, cor: cores.cinza }) + 20;
  }

  // Orientações numa caixa creme: mede o texto antes, para pintar o fundo do tamanho certo.
  y += 16;
  const recuo = 36;
  const blocoDeOrientacoes = (inicio: number, desenharAgora: boolean) =>
    dados.orientacoes.reduce(
      (topo, orientacao, i) =>
        escrever(
          orientacao,
          MARGEM + recuo,
          topo,
          { peso: i === 0 ? 700 : 400, tamanho: 27, largura: conteudo - 2 * recuo },
          desenharAgora,
        ) + 12,
      inicio,
    ) - 12;
  const fimDaCaixa = blocoDeOrientacoes(y + recuo, false) + recuo;
  if (pintar) {
    contexto.fillStyle = cores.creme;
    retanguloArredondado(contexto, MARGEM, y, conteudo, fimDaCaixa - y, 24);
    contexto.fill();
  }
  blocoDeOrientacoes(y + recuo, pintar);
  y = fimDaCaixa + 40;

  const agora = new Date();
  const data = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "America/Fortaleza" }).format(agora);
  const hora = new Intl.DateTimeFormat("pt-BR", { timeStyle: "short", timeZone: "America/Fortaleza" }).format(agora);
  y = escrever(`Comprovante gerado em ${data}, às ${hora}.`, MARGEM, y, { tamanho: 24, cor: cores.cinza }) + 4;
  y = escrever(`www.festivalflim.com.br · ${evento.emailContato}`, MARGEM, y, {
    peso: 700,
    tamanho: 24,
    cor: cores.azul,
  });

  return faixa(y + 56);
}

// Retângulo de cantos arredondados (o roundRect do canvas não existe nos iPhones mais antigos).
function retanguloArredondado(
  contexto: CanvasRenderingContext2D,
  x: number,
  y: number,
  largura: number,
  altura: number,
  raio: number,
) {
  contexto.beginPath();
  contexto.moveTo(x + raio, y);
  contexto.arcTo(x + largura, y, x + largura, y + altura, raio);
  contexto.arcTo(x + largura, y + altura, x, y + altura, raio);
  contexto.arcTo(x, y + altura, x, y, raio);
  contexto.arcTo(x, y, x + largura, y, raio);
  contexto.closePath();
}
