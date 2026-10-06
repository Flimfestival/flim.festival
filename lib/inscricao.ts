/*
 * Campos e regras do formulário de inscrição de estudantes.
 * Usado pela página /inscricao (no navegador) e pela ação que grava os dados (no servidor).
 */
import { atividadesInscricao, horariosSimultaneos } from "./programacao";

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

const anosFinais = fundamental.slice(5);

// Escolas da lista do formulário, em ordem alfabética, e os anos que cada uma oferece.
// Os anos seguem o Censo Escolar 2025 (Inep), consultado no QEdu; o Ensino Médio do CERB começou
// em 2026, informado pela organização. `rotulo` é o texto da lista quando difere do nome gravado.
// Sem `anos`, a escola aceita todos os anos. Para incluir uma escola, acrescente aqui.
// Quem estuda fora da lista escolhe "Outra escola" e digita o nome.
export const escolas: { nome: string; rotulo?: string; etapas?: string; anos?: string[] }[] = [
  {
    nome: "Centro Educacional Padre Carlos",
    etapas: "do 1º ao 5º ano do Ensino Fundamental",
    anos: anosIniciais,
  },
  {
    nome: "Centro Educacional Profª Agá Fernandes (CEPAF)",
    etapas: "do 1º ao 5º ano do Ensino Fundamental",
    anos: anosIniciais,
  },
  { nome: "Centro Educacional Profª Aninha Leite", etapas: "Ensino Fundamental", anos: fundamental },
  {
    nome: "Centro Educacional Professor João Onofre",
    etapas: "do 1º ao 5º ano do Ensino Fundamental",
    anos: anosIniciais,
  },
  {
    nome: "CERB",
    rotulo: "CERB (Centro Educacional Raimunda Barreto)",
    etapas: "do 6º ano do Ensino Fundamental ao 3º ano do Ensino Médio",
    anos: [...anosFinais, ...medio],
  },
  {
    nome: "CERBA",
    rotulo: "CERBA (Centro Educacional Profª Rita Baliza Alves)",
    etapas: "do 1º ao 5º ano do Ensino Fundamental",
    anos: anosIniciais,
  },
  {
    nome: "Colégio Efetivo",
    etapas: "do 1º ao 5º ano do Ensino Fundamental",
    anos: anosIniciais,
  },
  {
    nome: "Escola Estadual Almino Afonso",
    etapas: "Ensino Fundamental e Médio",
    anos: [...fundamental, ...medio],
  },
  {
    nome: "Escola Estadual Antônio João de Queiroz",
    etapas: "do 6º ano do Ensino Fundamental ao 3º ano do Ensino Médio",
    anos: [...anosFinais, ...medio],
  },
  {
    nome: "Escola Estadual Doutor Joaquim Inácio (E.E.J.I.)",
    etapas: "Ensino Médio",
    anos: medio,
  },
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
};

// Atividades só para estudantes das escolas de Martins (as da lista acima): quem escolhe
// "Outra escola" não pode se inscrever nelas.
export const ATIVIDADES_MUNICIPIO = ["concurso-redacao", "oficina-redacao", "oficina-poesia", "oficina-desenho"];
export const AVISO_MUNICIPIO = "Só para estudantes das escolas de Martins. Escolha a escola na lista.";

// Atividade exclusiva para crianças atípicas: só pode ser escolhida com a caixa "criança atípica" marcada.
export const ATIVIDADE_ATIPICOS = "oficina-desenho";

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
  | "responsavelNome"
  | "responsavelCpf"
  | "responsavelContato"
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
  // Responsável legal, exigido quando o participante tem menos de 18 anos.
  responsavelNome: string;
  responsavelCpf: string;
  responsavelContato: string;
  // Marcado quando o estudante é uma criança atípica; libera a oficina de desenho criativo.
  atipico: boolean;
  consentimento: boolean;
};

export type Erros = Partial<Record<Campo, string>>;

// Vagas restantes por atividade; null significa sem limite.
export type VagasRestantes = Record<string, number | null>;

export type EstadoInscricao =
  | { status: "inicial" }
  | { status: "erro"; mensagem: string; erros: Erros; valores: Valores; esgotadas?: string[] }
  // `acrescentadas`: atividades somadas a uma inscrição que já existia; `repetidas`: já estavam nela.
  | { status: "enviada"; valores: Valores; acrescentadas: string[]; repetidas: string[] };

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
    responsavelNome: texto("responsavelNome"),
    responsavelCpf: texto("responsavelCpf"),
    responsavelContato: texto("responsavelContato"),
    atipico: formData.get("atipico") === "sim",
    consentimento: formData.get("consentimento") === "sim",
  };
}

// Idade em anos completos na data de hoje, no fuso de Martins/RN. Null se a data for inválida.
export function idade(dataNascimento: string) {
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

  // Textos livres não podem começar com =, +, - ou @: na planilha exportada do Supabase eles virariam
  // fórmulas (injeção de fórmula). Nenhum nome ou descrição de verdade começa assim.
  const textosLivres: [Campo, string][] = [
    ["nome", valores.nome],
    ["escola", valores.escolaOutra ? valores.escola : ""],
    ["qualDeficiencia", valores.qualDeficiencia],
    ["responsavelNome", valores.responsavelNome],
  ];
  for (const [campo, texto] of textosLivres) {
    if (/^[=+\-@\t\r]/.test(texto)) {
      erros[campo] = "Comece com uma letra ou número.";
    }
  }

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
    const soMunicipio = valores.escolaOutra
      ? valores.atividades.filter((id) => ATIVIDADES_MUNICIPIO.includes(id))
      : [];
    if (!erros.atividades && soMunicipio.length > 0) {
      erros.atividades = `${soMunicipio.map(tituloAtividade).join("; ")}: ${AVISO_MUNICIPIO.replace(/^S/, "s")}`;
    }
    if (!erros.atividades && valores.atividades.includes(ATIVIDADE_ATIPICOS) && !valores.atipico) {
      erros.atividades = `${tituloAtividade(ATIVIDADE_ATIPICOS)}: exclusiva para crianças atípicas. Marque a opção “criança atípica” ou desmarque a oficina.`;
    }
    const conflitos = horariosSimultaneos.filter(
      ([a, b]) => valores.atividades.includes(a) && valores.atividades.includes(b),
    );
    if (!erros.atividades && conflitos.length > 0) {
      erros.atividades = conflitos
        .map(([a, b]) => `${tituloAtividade(a)} e ${tituloAtividade(b)} acontecem no mesmo horário.`)
        .concat("Escolha uma atividade de cada horário.")
        .join(" ");
    }
  }
  if (anos !== null && anos < 18) {
    if (valores.responsavelNome.length < 3 || valores.responsavelNome.length > 120) {
      erros.responsavelNome = "Informe o nome completo do responsável legal.";
    }
    if (!cpfValido(valores.responsavelCpf)) {
      erros.responsavelCpf = "Informe um CPF válido, com 11 números.";
    }
    if (!contatoValido(valores.responsavelContato)) {
      erros.responsavelContato = "Informe um telefone com DDD ou um e-mail do responsável.";
    }
  }
  if (!valores.consentimento) {
    erros.consentimento = "Para concluir, é preciso aceitar o termo de consentimento.";
  }

  return erros;
}

// Confere os dois dígitos verificadores do CPF (aceita com ou sem pontos e traço).
export function cpfValido(cpf: string) {
  const digitos = cpf.replace(/\D/g, "");
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return false;
  const verificador = (quantidade: number) => {
    let soma = 0;
    for (let i = 0; i < quantidade; i++) soma += Number(digitos[i]) * (quantidade + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return verificador(9) === Number(digitos[9]) && verificador(10) === Number(digitos[10]);
}

// Telefone com DDD (10 a 13 números) ou e-mail.
function contatoValido(contato: string) {
  if (contato.length > 120) return false;
  if (contato.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato);
  // Telefone: só números, espaços, parênteses, ponto, traço e "+" no início.
  if (!/^\+?[\d\s().-]+$/.test(contato)) return false;
  const digitos = contato.replace(/\D/g, "");
  return digitos.length >= 10 && digitos.length <= 13;
}
