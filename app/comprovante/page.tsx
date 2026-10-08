import type { Metadata } from "next";
import Link from "next/link";
import ConsultaComprovante from "@/components/ConsultaComprovante";
import Pagina from "@/components/Pagina";
import { evento } from "@/lib/evento";
import { metadadosPagina } from "@/lib/site";

export const metadata: Metadata = metadadosPagina({
  titulo: "Comprovante de inscrição",
  descricao:
    "Já se inscreveu no FLIM? Busque a inscrição pelo nome completo e pela data de nascimento e baixe o comprovante de novo.",
  caminho: "/comprovante",
});

export default function PaginaComprovante() {
  return (
    <Pagina>
      <div className="tiles tiles-thin" aria-hidden="true"></div>
      <section className="inscricao">
        <div className="container inscricao-conteudo">
          <div className="section-head inscricao-info">
            <p className="eyebrow eyebrow-blue">Comprovante</p>
            <h1>Baixe o comprovante de novo</h1>
            <p className="intro">
              Já fez a inscrição e não salvou o comprovante? Informe o nome completo e a data de
              nascimento do participante, como foram preenchidos na inscrição. Para menores de 18 anos,
              informe também o CPF do responsável legal.
            </p>
            <p className="intro">
              Ainda não se inscreveu? <Link href="/inscricao">Faça a inscrição</Link>. Dúvidas? Escreva
              para <a href={`mailto:${evento.emailContato}`}>{evento.emailContato}</a>.
            </p>
          </div>
          <ConsultaComprovante />
        </div>
      </section>
    </Pagina>
  );
}
