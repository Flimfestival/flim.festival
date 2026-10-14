import type { Metadata } from "next";
import FormularioLancamento from "@/components/FormularioLancamento";
import Pagina from "@/components/Pagina";
import { evento } from "@/lib/evento";
import { lancamento } from "@/lib/lancamento";
import { metadadosPagina } from "@/lib/site";

export const metadata: Metadata = metadadosPagina({
  titulo: "Lançamento de livros",
  descricao: lancamento.descricao,
  caminho: "/lancamento-de-livros",
});

export default function PaginaLancamento() {
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
            </dl>
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
