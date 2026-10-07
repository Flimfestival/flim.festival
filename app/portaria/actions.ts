"use server";

import { redirect } from "next/navigation";
import { dentroDoLimite } from "@/lib/limite";
import { abrirSessao, fecharSessao, senhaCorreta, sessaoValida } from "@/lib/portaria";
import { atividadesInscricao } from "@/lib/programacao";
import { clienteSupabase } from "@/lib/supabase";

export type Estudante = {
  id: string;
  nome: string;
  // Visitantes não têm escola nem ano escolar.
  escola: string | null;
  anoEscolar: string | null;
  dataNascimento: string;
  atividades: string[];
};

export type DadosAtividade = {
  estudantes: Estudante[];
  // Hora da entrada (ISO) de quem já entrou na atividade, pelo id da inscrição.
  presencas: Record<string, string>;
  // Vagas restantes; null quando a atividade não tem limite.
  vagasRestantes: number | null;
};

type Falha = { erro: string };

export async function entrar(_estadoAnterior: Falha | null, formData: FormData): Promise<Falha> {
  if (!(await dentroDoLimite("portaria"))) {
    return { erro: "Muitas tentativas de entrada desta conexão. Aguarde 15 minutos e tente de novo." };
  }
  if (!senhaCorreta(String(formData.get("senha") ?? ""))) {
    // A espera torna inviável testar muitas senhas em sequência.
    await new Promise((resolver) => setTimeout(resolver, 1500));
    return { erro: "Senha incorreta." };
  }
  await abrirSessao();
  redirect("/portaria");
}

export async function sair() {
  await fecharSessao();
  redirect("/portaria");
}

// Confere a sessão e o cliente do banco antes de qualquer leitura ou gravação.
async function acesso() {
  if (!(await sessaoValida())) return { erro: "A sessão expirou. Recarregue a página e entre de novo." };
  const supabase = clienteSupabase();
  if (!supabase) return { erro: "O banco de dados não está configurado neste ambiente." };
  return { supabase };
}

const atividadeValida = (id: string) => atividadesInscricao.some((atividade) => atividade.id === id);
const idValido = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// O Supabase devolve no máximo 1.000 linhas por consulta; esta função busca em páginas.
async function todasAsLinhas<T>(
  consulta: (de: number, ate: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
) {
  const linhas: T[] = [];
  for (let de = 0; ; de += 1000) {
    const { data, error } = await consulta(de, de + 999);
    if (error) throw new Error(error.message);
    linhas.push(...(data ?? []));
    if (!data || data.length < 1000) return linhas;
  }
}

export async function carregarAtividade(atividade: string): Promise<DadosAtividade | Falha> {
  const { supabase, erro } = await acesso();
  if (!supabase) return { erro };
  if (!atividadeValida(atividade)) return { erro: "Atividade desconhecida." };

  try {
    const [inscricoes, presencas, vagas] = await Promise.all([
      todasAsLinhas<{
        id: string;
        nome: string;
        escola: string | null;
        ano_escolar: string | null;
        data_nascimento: string;
        atividades: string[];
      }>((de, ate) =>
        supabase
          .from("inscricoes")
          .select("id, nome, escola, ano_escolar, data_nascimento, atividades")
          .order("nome")
          .range(de, ate),
      ),
      todasAsLinhas<{ inscricao_id: string; registrada_em: string }>((de, ate) =>
        supabase
          .from("presencas")
          .select("inscricao_id, registrada_em")
          .eq("atividade_id", atividade)
          .range(de, ate),
      ),
      supabase.from("vagas_atividades").select("vagas, inscritos").eq("id", atividade).single(),
    ]);
    if (vagas.error) throw new Error(vagas.error.message);

    return {
      estudantes: inscricoes.map((linha) => ({
        id: linha.id,
        nome: linha.nome,
        escola: linha.escola,
        anoEscolar: linha.ano_escolar,
        dataNascimento: linha.data_nascimento,
        atividades: linha.atividades,
      })),
      presencas: Object.fromEntries(presencas.map((linha) => [linha.inscricao_id, linha.registrada_em])),
      vagasRestantes:
        vagas.data.vagas === null ? null : Math.max(0, Number(vagas.data.vagas) - Number(vagas.data.inscritos)),
    };
  } catch (falha) {
    console.error("Portaria: falha ao carregar a atividade", falha);
    return { erro: "Não foi possível carregar os inscritos. Confira a internet e tente de novo." };
  }
}

export async function registrarEntrada(
  inscricao: string,
  atividade: string,
): Promise<{ hora: string; nova: boolean } | Falha> {
  const { supabase, erro } = await acesso();
  if (!supabase) return { erro };
  if (!idValido(inscricao) || !atividadeValida(atividade)) return { erro: "Dados inválidos." };

  const { data, error } = await supabase.rpc("registrar_presenca", {
    p_inscricao: inscricao,
    p_atividade: atividade,
  });
  if (error?.code === "P0002") return { erro: "Este estudante não está inscrito nesta atividade." };
  const linha = Array.isArray(data) ? data[0] : null;
  if (error || !linha) {
    console.error("Portaria: falha ao registrar entrada", error);
    return { erro: "Não foi possível registrar a entrada. Confira a internet e tente de novo." };
  }
  return { hora: String(linha.hora), nova: Boolean(linha.nova) };
}

export async function desfazerEntrada(inscricao: string, atividade: string): Promise<{ ok: true } | Falha> {
  const { supabase, erro } = await acesso();
  if (!supabase) return { erro };
  if (!idValido(inscricao) || !atividadeValida(atividade)) return { erro: "Dados inválidos." };

  const { error } = await supabase
    .from("presencas")
    .delete()
    .match({ inscricao_id: inscricao, atividade_id: atividade });
  if (error) {
    console.error("Portaria: falha ao desfazer entrada", error);
    return { erro: "Não foi possível desfazer a entrada. Tente de novo." };
  }
  return { ok: true };
}
