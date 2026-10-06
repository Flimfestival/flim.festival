"use server";

import { evento } from "@/lib/evento";
import {
  idade,
  lerValores,
  tituloAtividade,
  validar,
  type EstadoInscricao,
  type Valores,
} from "@/lib/inscricao";
import { dentroDoLimite } from "@/lib/limite";
import { clienteSupabase } from "@/lib/supabase";
import { TERMO_VERSAO } from "@/lib/termo";

export async function enviarInscricao(
  _estadoAnterior: EstadoInscricao,
  formData: FormData,
): Promise<EstadoInscricao> {
  const valores = lerValores(formData);

  // Campo invisível para pessoas. Se vier preenchido, foi um robô: responde como sucesso e descarta.
  if (String(formData.get("campo_extra") ?? "") !== "") {
    return { status: "enviada", valores, acrescentadas: [], repetidas: [] };
  }

  const erros = validar(valores);
  if (Object.keys(erros).length > 0) {
    return { status: "erro", mensagem: "Confira os campos destacados abaixo.", erros, valores };
  }

  if (!(await dentroDoLimite("inscricao"))) {
    return {
      status: "erro",
      mensagem: `Muitas inscrições foram enviadas desta conexão em pouco tempo. Aguarde 10 minutos e envie de novo. Escolas que precisam inscrever muitos estudantes podem escrever para ${evento.emailContato}.`,
      erros: {},
      valores,
    };
  }

  let resultado: Resultado;
  try {
    resultado = await salvar(valores);
  } catch (erro) {
    console.error("Falha ao gravar inscrição:", erro);
    return {
      status: "erro",
      mensagem: `Não foi possível enviar a inscrição agora. Tente de novo em alguns minutos. Se o problema continuar, escreva para ${evento.emailContato}.`,
      erros: {},
      valores,
    };
  }

  const nomes = (ids: string[]) => ids.map(tituloAtividade).join("; ");

  if (resultado.situacao === "conflito") {
    const pares = resultado.conflitos
      .map(([a, b]) => `${tituloAtividade(a)} e ${tituloAtividade(b)}`)
      .join("; ");
    return {
      status: "erro",
      mensagem: "Há atividades no mesmo horário. Nada foi alterado.",
      erros: {
        atividades: `Acontecem no mesmo horário: ${pares}. Este estudante já tem inscrição em uma delas ou marcou as duas; escolha uma atividade de cada horário.`,
      },
      valores,
    };
  }

  if (resultado.situacao === "nada_novo") {
    return {
      status: "erro",
      mensagem: "Este estudante já tem inscrição nas atividades escolhidas. Nada foi alterado.",
      erros: {
        atividades: `Inscrição já existente em: ${nomes(resultado.repetidas)}. Para se inscrever em outra atividade, marque só as novas. Dúvidas: ${evento.emailContato}.`,
      },
      valores,
    };
  }

  if (resultado.situacao === "esgotadas") {
    const esgotadas = resultado.esgotadas;
    return {
      status: "erro",
      mensagem: "Algumas atividades escolhidas não têm mais vagas.",
      erros: {
        atividades: `As vagas acabaram em: ${nomes(esgotadas)}. Essas atividades foram desmarcadas; confira as outras e envie de novo.`,
      },
      valores: { ...valores, atividades: valores.atividades.filter((id) => !esgotadas.includes(id)) },
      esgotadas,
    };
  }

  // Inscrição nova ou complementada: o comprovante mostra a inscrição como ficou gravada.
  return {
    status: "enviada",
    valores: resultado.inscricao ?? valores,
    acrescentadas:
      resultado.situacao === "acrescentada"
        ? valores.atividades.filter((id) => !resultado.repetidas.includes(id))
        : [],
    repetidas: resultado.repetidas,
  };
}

type Resultado = {
  situacao: "nova" | "acrescentada" | "nada_novo" | "esgotadas" | "conflito";
  esgotadas: string[];
  // Pares de atividades no mesmo horário, quando a situação é "conflito".
  conflitos: [string, string][];
  repetidas: string[];
  // Dados como ficaram no banco (numa inscrição complementada, os da primeira inscrição).
  inscricao?: Valores;
};

// Grava ou complementa a inscrição pela função `inscrever_estudante` do Supabase, que confere vagas
// e atividades repetidas numa única operação.
async function salvar(valores: Valores): Promise<Resultado> {
  const anos = idade(valores.dataNascimento);
  const menor = anos !== null && anos < 18;
  const parametros = {
    p_nome: valores.nome,
    p_escola: valores.escola,
    p_ano_escolar: valores.anoEscolar,
    p_data_nascimento: valores.dataNascimento,
    p_email: valores.email || null,
    p_possui_deficiencia: valores.deficiencia === "sim",
    p_deficiencia: valores.deficiencia === "sim" && valores.qualDeficiencia ? valores.qualDeficiencia : null,
    p_atividades: valores.atividades,
    p_consentimento: valores.consentimento,
    // Dados do responsável só valem para menores de 18 anos (a validação já exigiu nesses casos).
    p_responsavel_nome: menor ? valores.responsavelNome : null,
    p_responsavel_cpf: menor ? valores.responsavelCpf.replace(/\D/g, "") : null,
    p_responsavel_contato: menor ? valores.responsavelContato : null,
    p_termo_versao: TERMO_VERSAO,
  };

  const supabase = clienteSupabase();
  if (!supabase) {
    // Sem o Supabase configurado, no computador de desenvolvimento a inscrição só aparece no terminal
    // e as vagas não são controladas. No site publicado, falha de propósito para nada se perder sem aviso.
    if (process.env.NODE_ENV === "development") {
      console.info("[inscrição de teste, Supabase não configurado]", parametros);
      return { situacao: "nova", esgotadas: [], repetidas: [], conflitos: [] };
    }
    throw new Error("SUPABASE_URL ou SUPABASE_SECRET_KEY não configurada.");
  }

  const { data, error } = await supabase.rpc("inscrever_estudante", parametros);
  if (error || !data) {
    throw new Error(`Supabase recusou a inscrição: ${error?.message ?? "resposta vazia"}`);
  }

  const lista = (valor: unknown) => (Array.isArray(valor) ? valor.map(String) : []);
  return {
    situacao: data.situacao,
    esgotadas: lista(data.esgotadas),
    repetidas: lista(data.repetidas),
    conflitos: Array.isArray(data.conflitos)
      ? data.conflitos.map((par: unknown[]) => [String(par[0]), String(par[1])] as [string, string])
      : [],
    inscricao: data.nome
      ? {
          ...valores,
          nome: String(data.nome),
          escola: String(data.escola),
          anoEscolar: String(data.ano_escolar),
          dataNascimento: String(data.data_nascimento),
          atividades: lista(data.atividades),
          responsavelNome: data.responsavel_nome ? String(data.responsavel_nome) : "",
        }
      : undefined,
  };
}
