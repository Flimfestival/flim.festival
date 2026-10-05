import Image from "next/image";
import { evento } from "@/lib/evento";
import LinkInscricao from "./LinkInscricao";

export default function Abertura() {
  return (
    <section id="topo" className="hero">
      <div className="tiles" aria-hidden="true"></div>
      <div className="container hero-inner">
        <h1 className="hero-logo">
          <Image
            src="/assets/logo.svg"
            alt="FLIM, Festival Literário de Martins"
            width={420}
            height={316}
            preload
          />
        </h1>
        <p className="lead">
          Um encontro dedicado à leitura, à escrita e à formação de leitores, reunindo escritores,
          educadores, estudantes e a comunidade na Serra de Martins.
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
        <div className="actions">
          <LinkInscricao className="btn btn-primary">Fazer minha inscrição</LinkInscricao>
          <a href="#sobre" className="btn btn-outline">
            Saiba mais
          </a>
        </div>
      </div>
      <div className="tiles" aria-hidden="true"></div>
    </section>
  );
}
