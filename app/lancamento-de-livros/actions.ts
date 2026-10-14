"use server";

import { evento } from "@/lib/evento";
import { lerValoresLancamento, validarLancamento, type EstadoLancamento } from "@/lib/lancamento";
import { dentroDoLimite } from "@/lib/limite";
import { clienteSupabase } from "@/lib/supabase";

export async function enviarLancamento(
  _estadoAnterior: EstadoLancamento,
  formData: FormData,
): Promise<EstadoLancamento> {
  const valores = lerValoresLancamento(formData);

  // Campo invisível para pessoas. Se vier preenchido, foi um robô: responde como sucesso e descarta.
  if (String(formData.get("campo_extra") ?? "") !== "") return { status: "recebida", valores };

  const erros = validarLancamento(valores);
  if (Object.keys(erros).length > 0) {
    return { status: "erro", mensagem: "Confira os campos destacados abaixo.", erros, valores };
  }

  if (!(await dentroDoLimite("lancamento"))) {
    return {
      status: "erro",
      mensagem: "Muitos envios desta conexão em pouco tempo. Aguarde 10 minutos e envie de novo.",
      erros: {},
      valores,
    };
  }

  const supabase = clienteSupabase();
  if (!supabase) {
    // Sem o Supabase, no computador de desenvolvimento o envio só aparece no terminal.
    if (process.env.NODE_ENV === "development") {
      console.info("[lançamento de livro de teste, Supabase não configurado]", valores);
      return { status: "recebida", valores };
    }
    console.error("SUPABASE_URL ou SUPABASE_SECRET_KEY não configurada.");
    return {
      status: "erro",
      mensagem: `Não foi possível enviar agora. Escreva para ${evento.emailContato}.`,
      erros: {},
      valores,
    };
  }

  const { error } = await supabase.from("lancamentos_livros").insert({
    autor: valores.autor,
    cidade: valores.cidade,
    uf: valores.uf,
    email: valores.email,
    whatsapp: valores.whatsapp,
    titulo: valores.titulo,
    apresentacao: valores.apresentacao,
    minibiografia: valores.minibiografia,
    consentimento: valores.consentimento,
  });
  // 23505: o mesmo e-mail já tinha enviado este título. Para quem envia, é a mesma inscrição recebida.
  if (error && error.code !== "23505") {
    console.error("Falha ao gravar o lançamento de livro:", error);
    return {
      status: "erro",
      mensagem: `Não foi possível enviar agora. Tente de novo em alguns minutos. Se o problema continuar, escreva para ${evento.emailContato}.`,
      erros: {},
      valores,
    };
  }
  return { status: "recebida", valores };
}
