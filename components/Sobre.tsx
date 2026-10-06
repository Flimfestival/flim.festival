import Image from "next/image";
import { fotos } from "@/lib/fotos";

const eixos = [
  { titulo: "Formação de leitores", texto: "Mediação de leitura e contação de histórias." },
  { titulo: "Escrita criativa", texto: "Oficinas que incentivam a expressão autoral." },
  { titulo: "Educação", texto: "Diálogo com professores sobre leitura em sala de aula." },
  { titulo: "Cultura potiguar", texto: "Autores, histórias e saberes da região serrana." },
];

export default function Sobre() {
  return (
    <section id="sobre" className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow eyebrow-blue">O festival</p>
          <h2>A literatura como caminho para aprender, criar e conviver</h2>
          <p className="intro">
            O FLIM aproxima a comunidade do livro e da leitura, valoriza a produção literária
            potiguar e fortalece o papel da escola e das bibliotecas na formação de leitores.
          </p>
        </div>
        <figure className="foto-larga">
          <Image
            src={fotos.criancasLendo}
            alt="Grupo de crianças sentadas no chão, lendo livros juntas"
            sizes="(max-width: 1180px) 100vw, 1132px"
            placeholder="blur"
          />
        </figure>
        <ul className="eixos">
          {eixos.map((eixo) => (
            <li key={eixo.titulo}>
              <h3>{eixo.titulo}</h3>
              <p>{eixo.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
