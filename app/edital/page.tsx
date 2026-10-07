import type { Metadata } from "next";
import Link from "next/link";
import ChamadaFinal from "@/components/ChamadaFinal";
import LinkInscricao from "@/components/LinkInscricao";
import Pagina from "@/components/Pagina";
import { anexosEdital, edital, secoesEdital, type Bloco, type SecaoEdital } from "@/lib/edital";
import { evento } from "@/lib/evento";
import { metadadosPagina } from "@/lib/site";

export const metadata: Metadata = metadadosPagina({
  titulo: "Edital do concurso de redação",
  descricao:
    "Edital do Concurso de Redação “Memórias do Meu Lugar”, do FLIM: quem participa, categorias, inscrições até 7 de novembro, prova em 13 de dezembro e premiação.",
  caminho: "/edital",
});

// Resumo do edital, com os itens de onde cada informação vem.
const resumo = [
  { titulo: "Tema", texto: "“Memórias do Meu Lugar” (itens 1.4 e 8.1)." },
  {
    titulo: "Quem participa",
    texto: "Estudantes matriculados na Educação Básica no município de Martins (item 3).",
  },
  {
    titulo: "Categorias",
    texto:
      "4º e 5º anos: conto. 6º ao 9º ano: crônica. 1ª a 3ª série do Nível Médio: texto dissertativo-argumentativo (item 4).",
  },
  {
    titulo: "Inscrições",
    texto: "Gratuitas, pelo site, de 7 de outubro a 7 de novembro de 2026 (item 7).",
  },
  {
    titulo: "Prova",
    texto:
      "13 de dezembro de 2026, das 9h às 13h, na Escola Estadual Dr. Almino Afonso. Antes, o cortejo obrigatório sai às 8h da Igreja do Rosário (itens 5 e 6).",
  },
  {
    titulo: "Levar",
    texto: "Caneta esferográfica azul ou preta, de corpo transparente; água e um lanche leve (itens 6.5 e 6.7).",
  },
  {
    titulo: "Prêmios",
    texto:
      "1º lugar no Ensino Fundamental I e no II: um iPad 11, 128 GB. 1º lugar no Nível Médio: bolsa de estudos integral na Faculdade Evolução (item 12).",
  },
  {
    titulo: "Resultado",
    texto:
      "21 de dezembro de 2026. Premiação em 23 de dezembro, às 19h, na Casa de Cultura Popular de Martins (itens 16 e 17).",
  },
];

const ENDERECO_INSCRICAO = "https://www.festivalflim.com.br/inscricao";

// O endereço do formulário, citado no edital, vira link para a página de inscrição.
function comLinks(texto: string) {
  const partes = texto.split(ENDERECO_INSCRICAO);
  return partes.flatMap((parte, i) =>
    i === 0
      ? [parte]
      : [
          <Link key={i} href="/inscricao">
            www.festivalflim.com.br/inscricao
          </Link>,
          parte,
        ],
  );
}

// Número do item no início do parágrafo: "1.1", "I –" ou "a)".
const marcador = /^(\d+\.\d+|[IVX]+ –|[a-c]\))\s/;

function Blocos({ blocos }: { blocos: Bloco[] }) {
  return blocos.map((bloco, i) => {
    if (typeof bloco === "string") {
      const item = marcador.exec(bloco);
      const subitem = item && !/^\d/.test(item[1]);
      return (
        <p key={i} className={subitem ? "edital-subitem" : undefined}>
          {item && <strong>{item[1]} </strong>}
          {comLinks(item ? bloco.slice(item[0].length) : bloco)}
        </p>
      );
    }
    if ("lista" in bloco) {
      return (
        <ul key={i}>
          {bloco.lista.map((linha) => (
            <li key={linha}>{linha}</li>
          ))}
        </ul>
      );
    }
    const { tabela } = bloco;
    return (
      <div key={i} className="tabela-rolagem">
        <table className="tabela">
          <caption>{tabela.legenda}</caption>
          <thead>
            <tr>
              {tabela.colunas.map((coluna) => (
                <th key={coluna} scope="col">
                  {coluna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabela.linhas.map((linha) => (
              <tr key={linha[0]}>
                {/* O rótulo da coluna aparece antes do valor quando a tabela vira lista, no celular. */}
                {linha.map((celula, j) => (
                  <td key={j} data-rotulo={tabela.colunas[j]}>
                    {comLinks(celula)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
}

function Secoes({ secoes }: { secoes: SecaoEdital[] }) {
  return secoes.map((secao) => (
    <section key={secao.titulo}>
      <h3>{secao.titulo}</h3>
      <Blocos blocos={secao.blocos} />
    </section>
  ));
}

export default function PaginaEdital() {
  return (
    <Pagina>
      <div className="tiles tiles-thin" aria-hidden="true"></div>
      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow eyebrow-green">Concurso de redação</p>
            <h1>{edital.titulo}</h1>
            <p className="intro">
              Para estudantes da Educação Básica de Martins. Inscrições gratuitas pelo site até 7 de
              novembro de 2026; a prova é em 13 de dezembro.
            </p>
          </div>

          <article className="dia edital-resumo">
            <header className="dia-cabecalho">
              <h2>Resumo</h2>
              <p className="dia-local">O texto completo, que vale para todos os efeitos, está logo abaixo.</p>
            </header>
            <dl className="ficha">
              {resumo.map((item) => (
                <div key={item.titulo}>
                  <dt>{item.titulo}</dt>
                  <dd>{item.texto}</dd>
                </div>
              ))}
            </dl>
            <div className="secao-acao">
              <LinkInscricao className="btn btn-primary">Fazer a inscrição</LinkInscricao>
            </div>
          </article>

          <article className="dia edital-texto">
            <header className="dia-cabecalho">
              <p className="dia-data">Texto completo</p>
              <h2>{edital.titulo}</h2>
              <p className="dia-local">{edital.subtitulo}</p>
            </header>
            <p>{edital.abertura}</p>
            <Secoes secoes={secoesEdital} />
            <div className="edital-assinaturas">
              <p>{edital.data}</p>
              {edital.assinaturas.map((assinatura) => (
                <p key={assinatura.nome}>
                  <strong>{assinatura.nome}</strong>
                  <br />
                  {assinatura.cargo}
                </p>
              ))}
              <p className="edital-nota">Documento original assinado digitalmente.</p>
            </div>
          </article>

          <article className="dia edital-texto">
            <header className="dia-cabecalho">
              <p className="dia-data">Anexos</p>
              <h2>Bibliografia e grades de correção</h2>
            </header>
            <Secoes secoes={anexosEdital} />
          </article>

          <p className="intro edital-contato">
            Dúvidas sobre o concurso: <a href={`mailto:${evento.emailContato}`}>{evento.emailContato}</a>.
          </p>
        </div>
      </section>
      <ChamadaFinal />
    </Pagina>
  );
}
