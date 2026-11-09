import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import TopoPortaria from "@/components/TopoPortaria";
import { lancamento } from "@/lib/lancamento";
import { portariaConfigurada, sessaoValida } from "@/lib/portaria";
import { clienteSupabase } from "@/lib/supabase";

// Livros inscritos para o lançamento, com os contatos dos autores: só para a comissão, com a senha.
export const metadata: Metadata = {
  title: "Portaria",
  robots: { index: false, follow: false },
};

type Livro = {
  id: string;
  criado_em: string;
  autor: string;
  cidade: string;
  uf: string;
  email: string;
  whatsapp: string;
  titulo: string;
  apresentacao: string;
  minibiografia: string;
};

async function carregarLivros(): Promise<Livro[] | { erro: string }> {
  const supabase = clienteSupabase();
  if (!supabase) return { erro: "O banco de dados não está configurado neste ambiente." };
  const { data, error } = await supabase
    .from("lancamentos_livros")
    .select("id, criado_em, autor, cidade, uf, email, whatsapp, titulo, apresentacao, minibiografia")
    .order("criado_em")
    .limit(1000);
  if (error) {
    console.error("Portaria: falha ao carregar os lançamentos", error);
    return { erro: "Não foi possível carregar os livros. Confira a internet e recarregue a página." };
  }
  return data ?? [];
}

const formatarEnvio = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Fortaleza",
  });

// Link para abrir a conversa no WhatsApp; números sem o 55 do Brasil ganham o código do país.
function linkWhatsapp(numero: string) {
  const digitos = numero.replace(/\D/g, "").replace(/^0+/, "");
  return `https://wa.me/${digitos.length <= 11 ? `55${digitos}` : digitos}`;
}

export default async function PaginaLancamentos() {
  await connection();
  if (!portariaConfigurada() || !(await sessaoValida())) redirect("/portaria");

  const livros = await carregarLivros();
  const autores = Array.isArray(livros) ? new Set(livros.map((livro) => livro.email.toLowerCase())).size : 0;

  return (
    <div className="portaria">
      <TopoPortaria logado atual="lancamentos" />
      <main id="conteudo" className="portaria-conteudo painel">
        <div>
          <h1 className="portaria-titulo">Lançamento de livros</h1>
          <p className="dica">
            Livros inscritos pelo site para o lançamento de {lancamento.data}, na {lancamento.local}, na ordem de
            envio. Toque no WhatsApp ou no e-mail para falar com o autor.
          </p>
        </div>

        {!Array.isArray(livros) ? (
          <p role="alert" className="form-alerta">
            {livros.erro}
          </p>
        ) : (
          <>
            <dl className="painel-contadores painel-contadores-dois">
              <div>
                <dt>Livros</dt>
                <dd>{livros.length}</dd>
              </div>
              <div>
                <dt>Autores</dt>
                <dd>{autores}</dd>
              </div>
            </dl>

            {livros.length === 0 ? (
              <p className="painel-rodape">Nenhum livro inscrito até agora.</p>
            ) : (
              <ol className="lancamentos">
                {livros.map((livro, posicao) => (
                  <li key={livro.id} className="lancamento">
                    <p className="lancamento-envio">
                      Nº {posicao + 1} · enviado em {formatarEnvio(livro.criado_em)}
                    </p>
                    <h2 className="lancamento-titulo">{livro.titulo}</h2>
                    <p className="lancamento-autor">
                      {livro.autor} · {livro.cidade}/{livro.uf}
                    </p>
                    <p className="lancamento-contatos">
                      <a href={linkWhatsapp(livro.whatsapp)} target="_blank" rel="noopener noreferrer">
                        WhatsApp {livro.whatsapp}
                      </a>
                      <a href={`mailto:${livro.email}`}>{livro.email}</a>
                    </p>
                    <details>
                      <summary>Apresentação do livro</summary>
                      <p>{livro.apresentacao}</p>
                    </details>
                    <details>
                      <summary>Minibiografia</summary>
                      <p>{livro.minibiografia}</p>
                    </details>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </main>
    </div>
  );
}
