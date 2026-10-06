"use server";

import { evento } from "@/lib/evento";
import {
  lerValores,
  tituloAtividade,
  validar,
  type EstadoInscricao,
  type Valores,
} from "@/lib/inscricao";
import { clienteSupabase } from "@/lib/supabase";

export async function enviarInscricao(
  _estadoAnterior: EstadoInscricao,
  formData: FormData,
): Promise<EstadoInscricao> {
  const valores = lerValores(formData);
  const enviada: EstadoInscricao = { status: "enviada", valores };

  // Campo invisível para pessoas. Se vier preenchido, foi um robô: responde como sucesso e descarta.
  if (String(formData.get("campo_extra") ?? "") !== "") {
    return enviada;
  }

  const erros = validar(valores);
  if (Object.keys(erros).length > 0) {
    return { status: "erro", mensagem: "Confira os campos destacados abaixo.", erros, valores };
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

  if (resultado === "repetida") {
    return {
      status: "erro",
      mensagem: "Este estudante já tem inscrição no FLIM.",
      erros: {
        nome: `Já existe uma inscrição com este nome e esta data de nascimento. Para mudar as atividades, escreva para ${evento.emailContato}.`,
      },
      valores,
    };
  }

  const esgotadas = resultado;
  if (esgotadas.length > 0) {
    const nomes = esgotadas.map(tituloAtividade).join("; ");
    return {
      status: "erro",
      mensagem: "Algumas atividades escolhidas não têm mais vagas.",
      erros: {
        atividades: `As vagas acabaram em: ${nomes}. Essas atividades foram desmarcadas; confira as outras e envie de novo.`,
      },
      valores: { ...valores, atividades: valores.atividades.filter((id) => !esgotadas.includes(id)) },
      esgotadas,
    };
  }

  return enviada;
}

// Lista das atividades esgotadas (vazia se gravou) ou "repetida" se o estudante já tem inscrição.
type Resultado = string[] | "repetida";

// Grava a inscrição pela função `registrar_inscricao` do Supabase, que confere vagas e
// inscrições repetidas e grava numa única operação.
async function salvar(valores: Valores): Promise<Resultado> {
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
  };

  const supabase = clienteSupabase();
  if (!supabase) {
    // Sem o Supabase configurado, no computador de desenvolvimento a inscrição só aparece no terminal
    // e as vagas não são controladas. No site publicado, falha de propósito para nada se perder sem aviso.
    if (process.env.NODE_ENV === "development") {
      console.info("[inscrição de teste, Supabase não configurado]", parametros);
      return [];
    }
    throw new Error("SUPABASE_URL ou SUPABASE_SECRET_KEY não configurada.");
  }

  const { data, error } = await supabase.rpc("registrar_inscricao", parametros);
  // 23505: a função recusou porque o estudante já tem inscrição.
  if (error?.code === "23505") return "repetida";
  if (error) {
    throw new Error(`Supabase recusou a inscrição: ${error.message}`);
  }
  return Array.isArray(data) ? data.map(String) : [];
}
