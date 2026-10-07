import type { Metadata } from "next";
import Link from "next/link";
import FormularioInscricao from "@/components/FormularioInscricao";
import Pagina from "@/components/Pagina";
import { evento } from "@/lib/evento";
import { lerVagasRestantes } from "@/lib/vagas";
import { metadadosPagina } from "@/lib/site";

export const metadata: Metadata = metadadosPagina({
  titulo: "Inscrição",
  descricao:
    "Inscrição gratuita de estudantes e visitantes no Festival Literário de Martins (RN): escolha as atividades e garanta a vaga.",
  caminho: "/inscricao",
});

export default async function PaginaInscricao() {
  const vagas = await lerVagasRestantes();

  return (
    <Pagina>
      <div className="tiles tiles-thin" aria-hidden="true"></div>
      <section className="inscricao">
        <div className="container inscricao-conteudo">
          <div className="section-head inscricao-info">
            <p className="eyebrow eyebrow-blue">Inscrição</p>
            <h1>Faça a inscrição no FLIM</h1>
            <p className="intro">
              A participação é gratuita, para estudantes e visitantes. Preencha os dados e escolha as
              atividades. As vagas são limitadas e preenchidas por ordem de inscrição.
            </p>
            <dl className="facts">
              <div>
                <dt>Data</dt>
                <dd>{evento.data}</dd>
              </div>
              <div>
                <dt>Local</dt>
                <dd>{evento.local}</dd>
              </div>
              <div>
                <dt>Entrada</dt>
                <dd>Gratuita</dd>
              </div>
            </dl>
            <p className="intro">
              Confira os horários na <Link href="/programacao">programação completa</Link>. Dúvidas?
              Escreva para <a href={`mailto:${evento.emailContato}`}>{evento.emailContato}</a>.
            </p>
          </div>
          <FormularioInscricao vagas={vagas} />
        </div>
      </section>
    </Pagina>
  );
}
