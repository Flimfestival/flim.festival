"use server";

import { evento } from "@/lib/evento";
import { cpfValido, idade, normalizarNome, type Perfil, type Valores } from "@/lib/inscricao";
import { dentroDoLimite } from "@/lib/limite";
import { clienteSupabase } from "@/lib/supabase";

export type CampoConsulta = "nome" | "dataNascimento" | "responsavelCpf";

export type EstadoConsulta =
  | { status: "inicial" }
  | {
      status: "erro";
      mensagem: string;
      erros: Partial<Record<CampoConsulta, string>>;
      valores: Record<CampoConsulta, string>;
    }
  | { status: "encontrada"; inscricoes: Valores[] };

/*
 * Busca a inscrição de quem quer o comprovante de novo: mesmo nome completo (sem diferença de acentos,
 * maiúsculas e pontuação) e mesma data de nascimento. Para menores de 18 anos, também o CPF do
 * responsável legal, que só a família sabe. Devolve só o que aparece no comprovante: nunca e-mail,
 * CPF ou deficiência.
 */
export async function consultarInscricao(
  _estadoAnterior: EstadoConsulta,
  formData: FormData,
): Promise<EstadoConsulta> {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();
  const valores = {
    nome: texto("nome"),
    dataNascimento: texto("dataNascimento"),
    responsavelCpf: texto("responsavelCpf"),
  };

  const anos = idade(valores.dataNascimento);
  const menor = anos !== null && anos < 18;
  const erros: Partial<Record<CampoConsulta, string>> = {};
  if (valores.nome.length < 3 || valores.nome.length > 120) {
    erros.nome = "Informe o nome completo, como foi escrito na inscrição.";
  }
  if (anos === null || anos < 3 || anos > 100) {
    erros.dataNascimento = "Informe uma data de nascimento válida.";
  }
  if (menor && !cpfValido(valores.responsavelCpf)) {
    erros.responsavelCpf = "Informe o CPF do responsável legal, com 11 números.";
  }
  if (Object.keys(erros).length > 0) {
    return { status: "erro", mensagem: "Confira os campos destacados abaixo.", erros, valores };
  }

  if (!(await dentroDoLimite("consulta"))) {
    return {
      status: "erro",
      mensagem: "Muitas buscas desta conexão em pouco tempo. Aguarde 10 minutos e tente de novo.",
      erros: {},
      valores,
    };
  }

  const supabase = clienteSupabase();
  if (!supabase) {
    return {
      status: "erro",
      mensagem: `A busca não está disponível agora. Escreva para ${evento.emailContato}.`,
      erros: {},
      valores,
    };
  }

  // A data de nascimento reduz a busca a poucas inscrições; o nome é comparado aqui.
  const { data, error } = await supabase
    .from("inscricoes")
    .select("perfil, nome, data_nascimento, escola, ano_escolar, atividades, responsavel_nome, responsavel_cpf")
    .eq("data_nascimento", valores.dataNascimento)
    .limit(500);
  if (error || !data) {
    console.error("Falha ao buscar a inscrição:", error);
    return {
      status: "erro",
      mensagem: `Não foi possível buscar agora. Tente de novo em alguns minutos ou escreva para ${evento.emailContato}.`,
      erros: {},
      valores,
    };
  }

  const nome = normalizarNome(valores.nome);
  const cpf = valores.responsavelCpf.replace(/\D/g, "");
  const achadas = data.filter(
    (linha) => normalizarNome(String(linha.nome)) === nome && (!menor || linha.responsavel_cpf === cpf),
  );
  if (achadas.length === 0) {
    return {
      status: "erro",
      mensagem: `Não encontramos inscrição com esses dados. Confira se o nome completo e a data de nascimento${
        menor ? " e o CPF do responsável" : ""
      } estão iguais aos da inscrição. Se não encontrar, escreva para ${evento.emailContato}.`,
      erros: {},
      valores,
    };
  }

  return {
    status: "encontrada",
    inscricoes: achadas.map((linha) => ({
      perfil: (linha.perfil === "visitante" ? "visitante" : "estudante") as Perfil,
      nome: String(linha.nome),
      dataNascimento: String(linha.data_nascimento),
      email: "",
      escola: linha.escola ? String(linha.escola) : "",
      escolaOutra: false,
      anoEscolar: linha.ano_escolar ? String(linha.ano_escolar) : "",
      deficiencia: "",
      qualDeficiencia: "",
      atividades: Array.isArray(linha.atividades) ? linha.atividades.map(String) : [],
      responsavelNome: linha.responsavel_nome ? String(linha.responsavel_nome) : "",
      responsavelCpf: "",
      responsavelContato: "",
      atipico: false,
      consentimento: true,
    })),
  };
}
