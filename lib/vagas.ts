import "server-only";
import { connection } from "next/server";
import type { VagasRestantes } from "./inscricao";
import { lancamento } from "./lancamento";
import { clienteSupabase } from "./supabase";

// Vagas restantes de cada atividade, lidas a cada visita à página de inscrição.
// Retorna null se o Supabase não estiver configurado ou não responder; o formulário então não mostra vagas.
export async function lerVagasRestantes(): Promise<VagasRestantes | null> {
  await connection();
  const supabase = clienteSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.from("vagas_atividades").select("id, vagas, inscritos");
  if (error || !data) {
    console.error("Falha ao ler as vagas:", error);
    return null;
  }
  return Object.fromEntries(
    data.map((linha) => [
      linha.id,
      linha.vagas === null ? null : Math.max(0, Number(linha.vagas) - Number(linha.inscritos)),
    ]),
  );
}

// Vagas de autores que ainda restam no lançamento de livros (cada e-mail conta como um autor).
// Retorna null se o Supabase não estiver configurado ou não responder; a página então não mostra vagas.
export async function lerVagasLancamento(): Promise<number | null> {
  await connection();
  const supabase = clienteSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.from("lancamentos_livros").select("email").limit(1000);
  if (error || !data) {
    console.error("Falha ao ler as vagas do lançamento:", error);
    return null;
  }
  const autores = new Set(data.map((linha) => String(linha.email).toLowerCase())).size;
  return Math.max(0, lancamento.vagasAutores - autores);
}
