import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import TopoPortaria from "@/components/TopoPortaria";
import { lancamento } from "@/lib/lancamento";
import { portariaConfigurada, sessaoValida } from "@/lib/portaria";
import { clienteSupabase } from "@/lib/supabase";

// Autores e livros inscritos para o lançamento, com os contatos: só para a comissão, com a senha.
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

type Autor = { chave: string; livros: Livro[]; whatsapps: string[]; emails: string[] };

// Cada e-mail é um autor (é o que conta para as vagas e para os minutos de lançamento), na ordem do
// primeiro livro enviado. Os livros chegam já em ordem de envio.
function agruparPorAutor(livros: Livro[]) {
  const autores = new Map<string, Autor>();
  for (const livro of livros) {
    const chave = livro.email.toLowerCase();
    const autor = autores.get(chave) ?? { chave, livros: [], whatsapps: [], emails: [] };
    autor.livros.push(livro);
    if (!autor.whatsapps.includes(livro.whatsapp)) autor.whatsapps.push(livro.whatsapp);
    if (!autor.emails.includes(livro.email)) autor.emails.push(livro.email);
    autores.set(chave, autor);
  }
  return [...autores.values()];
}

export default async function PaginaLancamentos() {
  await connection();
  if (!portariaConfigurada() || !(await sessaoValida())) redirect("/portaria");

  const livros = await carregarLivros();
  const autores = Array.isArray(livros) ? agruparPorAutor(livros) : [];

  return (
    <div className="portaria">
      <TopoPortaria logado atual="lancamentos" />
      <main id="conteudo" className="portaria-conteudo painel">
        <div>
          <h1 className="portaria-titulo">Lançamento de livros</h1>
          <p className="dica">
            Autores inscritos pelo site para o lançamento de {lancamento.data}, na {lancamento.local}, na ordem
            de inscrição, com os livros de cada um. São {lancamento.vagasAutores} vagas, com{" "}
            {lancamento.minutosPorAutor} minutos por autor. Toque no WhatsApp ou no e-mail para falar com o autor.
          </p>
        </div>

        {!Array.isArray(livros) ? (
          <p role="alert" className="form-alerta">
            {livros.erro}
          </p>
        ) : (
          <>
            <dl className="painel-contadores">
              <div>
                <dt>Autores</dt>
                <dd>{autores.length}</dd>
              </div>
              <div>
                <dt>Vagas restantes</dt>
                <dd>{Math.max(0, lancamento.vagasAutores - autores.length)}</dd>
              </div>
              <div>
                <dt>Livros</dt>
                <dd>{livros.length}</dd>
              </div>
            </dl>

            {livros.length === 0 ? (
              <p className="painel-rodape">Nenhum autor inscrito até agora.</p>
            ) : (
              <ol className="lancamentos">
                {autores.map((autor, posicao) => {
                  const [primeiro] = autor.livros;
                  // A minibiografia mais recente, caso o autor tenha mudado o texto de um envio para outro.
                  const minibiografia = autor.livros[autor.livros.length - 1].minibiografia;
                  return (
                    <li key={autor.chave} className="lancamento">
                      <p className="lancamento-envio">
                        Autor nº {posicao + 1} · inscrição em {formatarEnvio(primeiro.criado_em)}
                      </p>
                      <h2 className="lancamento-titulo">{primeiro.autor}</h2>
                      <p className="lancamento-autor">
                        {primeiro.cidade}/{primeiro.uf} ·{" "}
                        {autor.livros.length === 1 ? "1 livro" : `${autor.livros.length} livros`}
                      </p>
                      <p className="lancamento-contatos">
                        {autor.whatsapps.map((whatsapp) => (
                          <a key={whatsapp} href={linkWhatsapp(whatsapp)} target="_blank" rel="noopener noreferrer">
                            WhatsApp {whatsapp}
                          </a>
                        ))}
                        {autor.emails.map((email) => (
                          <a key={email} href={`mailto:${email}`}>
                            {email}
                          </a>
                        ))}
                      </p>
                      <ul className="lancamento-livros">
                        {autor.livros.map((livro) => (
                          <li key={livro.id}>
                            <details>
                              <summary>{livro.titulo}</summary>
                              <p className="lancamento-envio">Enviado em {formatarEnvio(livro.criado_em)}</p>
                              <p>{livro.apresentacao}</p>
                            </details>
                          </li>
                        ))}
                      </ul>
                      <details>
                        <summary>Minibiografia</summary>
                        <p>{minibiografia}</p>
                      </details>
                    </li>
                  );
                })}
              </ol>
            )}
          </>
        )}
      </main>
    </div>
  );
}
