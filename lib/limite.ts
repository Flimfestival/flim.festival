import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { clienteSupabase } from "./supabase";

/*
 * Limite de tentativas por conexão, contado no banco (função `consumir_limite`).
 * A conexão é identificada por um código embaralhado do endereço IP, nunca pelo endereço em si.
 * Escolas costumam ter uma conexão só para várias turmas, por isso o limite de inscrições é folgado.
 */
const limites = {
  // 45 inscrições a cada 10 minutos por conexão: dá para uma turma inteira, mas barra envios em massa.
  inscricao: { limite: 45, janelaSegundos: 10 * 60 },
  // 10 tentativas de senha a cada 15 minutos por conexão, no painel da portaria.
  portaria: { limite: 10, janelaSegundos: 15 * 60 },
  // 30 buscas de comprovante a cada 10 minutos por conexão: dá para uma turma, mas impede tentativas
  // em massa de nomes e datas de nascimento.
  consulta: { limite: 30, janelaSegundos: 10 * 60 },
};

export async function dentroDoLimite(tipo: keyof typeof limites) {
  const supabase = clienteSupabase();
  if (!supabase) return true;

  const cabecalhos = await headers();
  const ip =
    cabecalhos.get("x-real-ip") ?? cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";
  const codigo = createHmac("sha256", process.env.SUPABASE_SECRET_KEY ?? "").update(ip).digest("base64url");

  const { limite, janelaSegundos } = limites[tipo];
  const { data, error } = await supabase.rpc("consumir_limite", {
    p_chave: `${tipo}:${codigo}`,
    p_limite: limite,
    p_janela_segundos: janelaSegundos,
  });
  if (error) {
    // Se o limite falhar, a inscrição segue: é melhor do que impedir quem está se inscrevendo de verdade.
    console.error("Falha ao conferir o limite de envios:", error.message);
    return true;
  }
  return data !== false;
}
