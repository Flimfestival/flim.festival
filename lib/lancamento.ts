/*
 * Inscrição de livros para o lançamento no FLIM (12/12/2026, Casa de Cultura de Martins).
 * Campos e regras usados pela página /lancamento-de-livros (no navegador) e pela ação que grava no
 * Supabase (no servidor).
 */

export const lancamento = {
  descricao:
    "Inscreva sua obra para participar do momento de lançamento de livros do FLIM, no dia 12 de dezembro de 2026, na Casa de Cultura de Martins.",
  data: "12 de dezembro",
  local: "Casa de Cultura de Martins",
  confirmacao:
    "A organização entrará em contato para confirmar sua participação e alinhar horário e formato do lançamento.",
};

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// Tamanhos máximos (os mesmos da tabela lancamentos_livros no banco).
export const tamanhos = { autor: 120, cidade: 80, titulo: 200, apresentacao: 1000, minibiografia: 600 };
// Mínimo de caracteres dos textos longos, para não chegar só uma palavra.
const MINIMO_TEXTO = 20;

export type CampoLancamento =
  | "autor"
  | "cidade"
  | "uf"
  | "email"
  | "whatsapp"
  | "titulo"
  | "apresentacao"
  | "minibiografia"
  | "consentimento";

export type ValoresLancamento = {
  autor: string;
  cidade: string;
  uf: string;
  email: string;
  whatsapp: string;
  titulo: string;
  apresentacao: string;
  minibiografia: string;
  consentimento: boolean;
};

export type ErrosLancamento = Partial<Record<CampoLancamento, string>>;

export type EstadoLancamento =
  | { status: "inicial" }
  | { status: "erro"; mensagem: string; erros: ErrosLancamento; valores: ValoresLancamento }
  | { status: "recebida"; valores: ValoresLancamento };

export function lerValoresLancamento(formData: FormData): ValoresLancamento {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();
  return {
    autor: texto("autor"),
    cidade: texto("cidade"),
    uf: texto("uf"),
    email: texto("email"),
    whatsapp: texto("whatsapp"),
    titulo: texto("titulo"),
    apresentacao: texto("apresentacao"),
    minibiografia: texto("minibiografia"),
    consentimento: formData.get("consentimento") === "sim",
  };
}

export function validarLancamento(valores: ValoresLancamento): ErrosLancamento {
  const erros: ErrosLancamento = {};
  const fora = (texto: string, minimo: number, maximo: number) => texto.length < minimo || texto.length > maximo;

  if (fora(valores.autor, 3, tamanhos.autor)) erros.autor = "Informe o nome do autor.";
  if (fora(valores.cidade, 2, tamanhos.cidade)) erros.cidade = "Informe a cidade.";
  if (!UFS.includes(valores.uf)) erros.uf = "Escolha a UF.";
  if (valores.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email)) {
    erros.email = "Informe um e-mail válido, como nome@exemplo.com.";
  }
  const digitos = valores.whatsapp.replace(/\D/g, "");
  if (!/^\+?[\d\s().-]+$/.test(valores.whatsapp) || digitos.length < 10 || digitos.length > 13) {
    erros.whatsapp = "Informe o WhatsApp com DDD, como (84) 99999-9999.";
  }
  if (fora(valores.titulo, 1, tamanhos.titulo)) erros.titulo = "Informe o título do livro.";
  if (fora(valores.apresentacao, MINIMO_TEXTO, tamanhos.apresentacao)) {
    erros.apresentacao = `Escreva uma breve apresentação do livro, de ${MINIMO_TEXTO} a ${tamanhos.apresentacao} caracteres.`;
  }
  if (fora(valores.minibiografia, MINIMO_TEXTO, tamanhos.minibiografia)) {
    erros.minibiografia = `Escreva a minibiografia, de ${MINIMO_TEXTO} a ${tamanhos.minibiografia} caracteres.`;
  }
  // Textos não podem começar com =, +, - ou @: na planilha exportada do Supabase eles virariam fórmulas.
  const textosLivres: CampoLancamento[] = ["autor", "cidade", "titulo", "apresentacao", "minibiografia"];
  for (const campo of textosLivres) {
    if (/^[=+@-]/.test(String(valores[campo]))) erros[campo] = "Comece com uma letra ou número.";
  }
  if (!valores.consentimento) erros.consentimento = "Para enviar, é preciso autorizar o uso dos dados.";
  return erros;
}
