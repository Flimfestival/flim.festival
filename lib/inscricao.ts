/*
 * Campos e regras do formulário de inscrição de estudantes.
 * Usado pela página /inscricao (no navegador) e pela ação que grava os dados (no servidor).
 */
import { atividadesInscricao } from "./programacao";

// Ano escolar e, quando houver, a categoria do concurso de redação correspondente.
export const anosEscolares: { nome: string; categoriaRedacao?: string }[] = [
  { nome: "1º ano do Ensino Fundamental" },
  { nome: "2º ano do Ensino Fundamental" },
  { nome: "3º ano do Ensino Fundamental" },
  { nome: "4º ano do Ensino Fundamental", categoriaRedacao: "Conto" },
  { nome: "5º ano do Ensino Fundamental", categoriaRedacao: "Conto" },
  { nome: "6º ano do Ensino Fundamental", categoriaRedacao: "Crônica" },
  { nome: "7º ano do Ensino Fundamental", categoriaRedacao: "Crônica" },
  { nome: "8º ano do Ensino Fundamental", categoriaRedacao: "Crônica" },
  { nome: "9º ano do Ensino Fundamental", categoriaRedacao: "Crônica" },
  { nome: "1º ano do Ensino Médio", categoriaRedacao: "Dissertação argumentativa (modelo ENEM)" },
  { nome: "2º ano do Ensino Médio", categoriaRedacao: "Dissertação argumentativa (modelo ENEM)" },
  { nome: "3º ano do Ensino Médio", categoriaRedacao: "Dissertação argumentativa (modelo ENEM)" },
];

const fundamental = anosEscolares.filter((ano) => ano.nome.includes("Fundamental")).map((ano) => ano.nome);
const medio = anosEscolares.filter((ano) => ano.nome.includes("Médio")).map((ano) => ano.nome);
const anosIniciais = fundamental.slice(0, 5);

// Escolas da lista do formulário, em ordem alfabética, e os anos que cada uma oferece.
// As etapas das escolas municipais seguem o Censo Escolar 2025 (Inep), consultado no QEdu.
// Sem `anos`, a escola aceita todos os anos. Para incluir uma escola, acrescente aqui.
// Quem estuda fora da lista escolhe "Outra escola" e digita o nome.
export const escolas: { nome: string; etapas?: string; anos?: string[] }[] = [
  {
    nome: "Centro Educacional Padre Carlos",
    etapas: "do 1º ao 5º ano do Ensino Fundamental",
    anos: anosIniciais,
  },
  {
    nome: "Centro Educacional Profª Agá Fernandes (CEPAF)",
    etapas: "Ensino Fundamental",
    anos: fundamental,
  },
  { nome: "Centro Educacional Profª Aninha Leite", etapas: "Ensino Fundamental", anos: fundamental },
  {
    nome: "Centro Educacional Professor João Onofre",
    etapas: "do 1º ao 5º ano do Ensino Fundamental",
    anos: anosIniciais,
  },
  {
    nome: "CERB",
    etapas: "do 6º ano do Ensino Fundamental ao 3º ano do Ensino Médio",
    anos: [...fundamental.slice(5), ...medio],
  },
  { nome: "CERBA", etapas: "Ensino Fundamental", anos: fundamental },
  { nome: "Colégio Efetivo" },
  {
    nome: "Escola Estadual Almino Afonso",
    etapas: "Ensino Fundamental e Médio",
    anos: [...fundamental, ...medio],
  },
  {
    nome: "Escola Estadual Antônio João de Queiroz",
    etapas: "Ensino Fundamental e Médio",
    anos: [...fundamental, ...medio],
  },
  { nome: "Escola Estadual Joaquim Inácio (E.E.J.I.)", etapas: "Ensino Médio", anos: medio },
];
export const OUTRA_ESCOLA = "outra";

// Anos que podem ser escolhidos para a escola; para "Outra escola" ou nenhuma, todos.
export function anosDaEscola(escola: string) {
  return escolas.find((item) => item.nome === escola)?.anos ?? anosEscolares.map((ano) => ano.nome);
}

export function categoriaRedacao(anoEscolar: string) {
  return anosEscolares.find((ano) => ano.nome === anoEscolar)?.categoriaRedacao;
}

// Atividades restritas a alguns anos escolares. As que não estão aqui são abertas a todos os anos.
export const restricoesPorAno: Record<string, { anos: string[]; aviso: string }> = {
  "concurso-redacao": {
    anos: anosEscolares.filter((ano) => ano.categoriaRedacao).map((ano) => ano.nome),
    aviso: "Para estudantes do 4º ano do Ensino Fundamental ao 3º ano do Ensino Médio.",
  },
  "concurso-desenho": {
    anos: anosEscolares.slice(0, 3).map((ano) => ano.nome),
    aviso: "Para estudantes do 1º ao 3º ano do Ensino Fundamental.",
  },
};

// Se o ano escolar ainda não foi escolhido, todas as atividades aparecem disponíveis.
export function podeParticipar(atividade: string, anoEscolar: string) {
  const restricao = restricoesPorAno[atividade];
  return !restricao || !anoEscolar || restricao.anos.includes(anoEscolar);
}

export function tituloAtividade(id: string) {
  return atividadesInscricao.find((atividade) => atividade.id === id)?.titulo ?? id;
}

export type Campo =
  | "nome"
  | "dataNascimento"
  | "email"
  | "escola"
  | "anoEscolar"
  | "deficiencia"
  | "qualDeficiencia"
  | "atividades"
  | "consentimento";

export type Valores = {
  nome: string;
  dataNascimento: string;
  email: string;
  // Nome gravado no banco: o escolhido na lista ou o digitado em "Outra escola".
  escola: string;
  escolaOutra: boolean;
  anoEscolar: string;
  deficiencia: string;
  qualDeficiencia: string;
  atividades: string[];
  consentimento: boolean;
};

export type Erros = Partial<Record<Campo, string>>;

// Vagas restantes por atividade; null significa sem limite.
export type VagasRestantes = Record<string, number | null>;

export type EstadoInscricao =
  | { status: "inicial" }
  | { status: "erro"; mensagem: string; erros: Erros; valores: Valores; esgotadas?: string[] }
  | { status: "enviada"; valores: Valores };

export function lerValores(formData: FormData): Valores {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();
  const escolaOutra = texto("escola") === OUTRA_ESCOLA;
  return {
    nome: texto("nome"),
    dataNascimento: texto("dataNascimento"),
    email: texto("email"),
    escola: escolaOutra ? texto("escolaOutra") : texto("escola"),
    escolaOutra,
    anoEscolar: texto("anoEscolar"),
    deficiencia: texto("deficiencia"),
    qualDeficiencia: texto("qualDeficiencia"),
    atividades: formData.getAll("atividades").map(String),
    consentimento: formData.get("consentimento") === "sim",
  };
}

// Idade em anos completos na data de hoje, no fuso de Martins/RN. Null se a data for inválida.
function idade(dataNascimento: string) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataNascimento);
  if (!partes) return null;
  const [ano, mes, dia] = partes.slice(1).map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  if (data.getUTCFullYear() !== ano || data.getUTCMonth() !== mes - 1 || data.getUTCDate() !== dia) {
    return null;
  }
  const [hojeAno, hojeMes, hojeDia] = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Fortaleza" })
    .format(new Date())
    .split("-")
    .map(Number);
  const fezAniversario = hojeMes > mes || (hojeMes === mes && hojeDia >= dia);
  return hojeAno - ano - (fezAniversario ? 0 : 1);
}

export function validar(valores: Valores): Erros {
  const erros: Erros = {};

  if (valores.nome.length < 3 || valores.nome.length > 120) {
    erros.nome = "Informe o nome completo do estudante.";
  }
  const anos = idade(valores.dataNascimento);
  if (anos === null || anos < 3 || anos > 100) {
    erros.dataNascimento = "Informe uma data de nascimento válida.";
  }
  if (
    valores.email &&
    (valores.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email))
  ) {
    erros.email = "Informe um e-mail válido, como nome@exemplo.com, ou deixe em branco.";
  }
  if (valores.escolaOutra) {
    if (valores.escola.length < 2 || valores.escola.length > 160) {
      erros.escola = "Digite o nome da escola.";
    }
  } else if (!escolas.some((escola) => escola.nome === valores.escola)) {
    erros.escola = "Escolha a escola.";
  }
  if (!anosEscolares.some((ano) => ano.nome === valores.anoEscolar)) {
    erros.anoEscolar = "Escolha o ano escolar.";
  } else if (!erros.escola && !anosDaEscola(valores.escola).includes(valores.anoEscolar)) {
    erros.anoEscolar = `Esta escola não oferece o ${valores.anoEscolar}. Confira a escola e o ano escolar.`;
  }
  if (valores.deficiencia !== "sim" && valores.deficiencia !== "nao") {
    erros.deficiencia = "Responda se o estudante possui alguma deficiência.";
  }
  if (valores.qualDeficiencia.length > 500) {
    erros.qualDeficiencia = "Use no máximo 500 caracteres.";
  }
  if (
    valores.atividades.length === 0 ||
    valores.atividades.some((id) => !atividadesInscricao.some((atividade) => atividade.id === id))
  ) {
    erros.atividades = "Marque pelo menos uma atividade.";
  } else if (!erros.anoEscolar) {
    const fora = valores.atividades.filter((id) => !podeParticipar(id, valores.anoEscolar));
    if (fora.length > 0) {
      erros.atividades = fora
        .map((id) => `${tituloAtividade(id)}: ${restricoesPorAno[id].aviso.replace(/^P/, "p")}`)
        .join(" ");
    }
  }
  if (!valores.consentimento) {
    erros.consentimento = "Para concluir, é preciso autorizar o uso dos dados da inscrição.";
  }

  return erros;
}
