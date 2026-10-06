import Image from "next/image";
import Link from "next/link";
import { fotosConvidados } from "@/lib/fotos";
import { destaques } from "@/lib/programacao";

const iniciais = (nome: string) =>
  nome
    .split(" ")
    .map((parte) => parte[0])
    .join("");

export default function Destaques() {
  return (
    <section id="destaques" className="section section-tint">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow eyebrow-blue">Destaques</p>
          <h2>Quem vem ao FLIM</h2>
          <p className="intro">
            Três dias com palestras, painéis e sarau ao lado de nomes da literatura nordestina.
          </p>
        </div>
        <ul className="destaques">
          {destaques.map((convidado) => {
            const retrato = fotosConvidados[convidado.nome];
            return (
              <li key={convidado.nome} className="convidado">
                {retrato ? (
                  // Sem texto alternativo: o nome aparece logo abaixo da foto.
                  <div className="convidado-foto">
                    <Image
                      src={retrato.foto}
                      alt=""
                      fill
                      sizes="(max-width: 900px) min(100vw, 520px), 370px"
                      placeholder="blur"
                      style={{ objectFit: "cover", objectPosition: retrato.posicao }}
                    />
                  </div>
                ) : (
                  <span className="monograma" aria-hidden="true">
                    {iniciais(convidado.nome)}
                  </span>
                )}
                <div className="convidado-texto">
                  <h3>{convidado.nome}</h3>
                  <p className="convidado-papel">{convidado.papel}</p>
                  <p className="convidado-atividade">{convidado.atividade}</p>
                  <p className="convidado-quando">
                    {convidado.quando}
                    <br />
                    {convidado.local}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="secao-acao">
          <Link href="/programacao" className="btn btn-outline">
            Ver a programação completa
          </Link>
        </div>
      </div>
    </section>
  );
}
