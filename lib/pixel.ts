/*
 * Pixel da Meta (Facebook e Instagram), para medir as campanhas de divulgação do FLIM.
 * Só carrega depois que a pessoa aceita o aviso de cookies (components/PixelMeta.tsx), não lê os
 * formulários (configuração automática desligada) e nunca envia dados das inscrições: só avisa que
 * uma inscrição foi concluída.
 */
export const PIXEL_META = "2313866966115918";

// Escolha guardada no navegador: "aceito" ou "recusado"; sem escolha, o aviso aparece.
export type EscolhaCookies = "aceito" | "recusado";
const CHAVE = "flim-cookies";

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

// Leitura e gravação da escolha, com aviso a quem acompanha (o aviso de cookies e o rodapé).
const assinantes = new Set<() => void>();
// Cópia em memória, para quando o navegador não deixa gravar (alguns modos anônimos).
let escolhaEmMemoria: EscolhaCookies | null = null;

export function assinarEscolha(aviso: () => void) {
  assinantes.add(aviso);
  return () => {
    assinantes.delete(aviso);
  };
}

export function lerEscolha(): EscolhaCookies | null {
  try {
    const valor = localStorage.getItem(CHAVE);
    return valor === "aceito" || valor === "recusado" ? valor : escolhaEmMemoria;
  } catch {
    return escolhaEmMemoria;
  }
}

export function gravarEscolha(escolha: EscolhaCookies | null) {
  escolhaEmMemoria = escolha;
  try {
    if (escolha) localStorage.setItem(CHAVE, escolha);
    else localStorage.removeItem(CHAVE);
  } catch {
    // Sem acesso ao armazenamento: a escolha vale até a pessoa fechar a página.
  }
  // Se o pixel já estava carregado, recusar faz ele parar de enviar, e aceitar de novo o retoma.
  if (escolha === "recusado") window.fbq?.("consent", "revoke");
  if (escolha === "aceito") window.fbq?.("consent", "grant");
  assinantes.forEach((aviso) => aviso());
}

// Carrega o pixel (o código oficial da Meta, reescrito aqui) e registra a visita à página.
export function carregarPixel() {
  if (window.fbq) {
    window.fbq("consent", "grant");
    return;
  }
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  // Sem configuração automática: o pixel não lê botões nem campos de formulário.
  fbq("set", "autoConfig", false, PIXEL_META);
  fbq("init", PIXEL_META);
  fbq("track", "PageView");
}

export function registrarVisita() {
  window.fbq?.("track", "PageView");
}

// Conversões da campanha: toda inscrição concluída e, à parte, a que inclui o concurso de redação.
export function registrarInscricao(comConcurso: boolean) {
  window.fbq?.("track", "CompleteRegistration");
  if (comConcurso) window.fbq?.("track", "Lead", { content_name: "Concurso de redação" });
}
