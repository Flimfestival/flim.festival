import type { Metadata } from "next";
import Link from "next/link";
import LinkInscricao from "@/components/LinkInscricao";
import Pagina from "@/components/Pagina";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NaoEncontrada() {
  return (
    <Pagina>
      <div className="tiles tiles-thin" aria-hidden="true"></div>
      <section className="section section-tint">
        <div className="container section-head">
          <p className="eyebrow eyebrow-blue">Erro 404</p>
          <h1>Esta página não existe</h1>
          <p className="intro">
            O endereço pode ter mudado ou ter sido digitado com algum erro. Confira a programação ou
            faça a inscrição.
          </p>
          <div className="actions acoes-404">
            <LinkInscricao className="btn btn-primary">Fazer inscrição</LinkInscricao>
            <Link href="/programacao" className="btn btn-outline">
              Ver a programação
            </Link>
          </div>
        </div>
      </section>
    </Pagina>
  );
}
