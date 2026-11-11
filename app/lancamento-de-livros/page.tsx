import type { Metadata } from "next";
import FormularioLancamento from "@/components/FormularioLancamento";
import Pagina from "@/components/Pagina";
import { evento } from "@/lib/evento";
import { lancamento, regrasLancamento } from "@/lib/lancamento";
import { metadadosPagina } from "@/lib/site";
import { lerVagasLancamento } from "@/lib/vagas";

export const metadata: Metadata = metadadosPagina({
  titulo: "Lançamento de livros",
  descricao: lancamento.descricao,
  caminho: "/lancamento-de-livros",
});

export default async function PaginaLancamento() {
  // Lidas a cada visita: a página é dinâmica por causa das vagas.
  const vagas = await lerVagasLancamento();

  return (
    <Pagina>
      <div className="tiles tiles-thin" aria-hidden="true"></div>
      <section className="inscricao">
        <div className="container inscricao-conteudo">
          <div className="section-head inscricao-info">
            <p className="eyebrow eyebrow-blue">Lançamento de livros</p>
            <h1>Lance seu livro no FLIM</h1>
            <p className="intro">{lancamento.descricao}</p>
            <dl className="facts">
              <div>
                <dt>Data</dt>
                <dd>{lancamento.data}</dd>
              </div>
              <div>
                <dt>Local</dt>
                <dd>{lancamento.local}</dd>
              </div>
              <div>
                <dt>Vagas</dt>
                <dd>{lancamento.vagasAutores} autores</dd>
              </div>
            </dl>
            <p className="intro">
              {regrasLancamento} Inscreva um livro por vez, sempre com o mesmo e-mail.
            </p>
            {vagas !== null && (
              <p className="intro lancamento-vagas">
                {vagas === 0 ? (
                  <>
                    <strong>As {lancamento.vagasAutores} vagas para autores já foram preenchidas.</strong> Quem já
                    inscreveu um livro ainda pode incluir outros, usando o mesmo e-mail.
                  </>
                ) : (
                  <strong>
                    {vagas === 1
                      ? `Resta 1 vaga para autor, de ${lancamento.vagasAutores}.`
                      : `Restam ${vagas} vagas para autores, de ${lancamento.vagasAutores}.`}
                  </strong>
                )}
              </p>
            )}
            <p className="intro">
              Dúvidas? Escreva para <a href={`mailto:${evento.emailContato}`}>{evento.emailContato}</a>.
            </p>
          </div>
          <FormularioLancamento />
        </div>
      </section>
    </Pagina>
  );
}
