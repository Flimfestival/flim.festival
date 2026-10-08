import Link from "next/link";
import LinkInscricao from "./LinkInscricao";

const passos = [
  { titulo: "Acesse o formulário", texto: "Clique em “Inscreva-se” para abrir o formulário de inscrição." },
  {
    titulo: "Preencha os dados",
    texto: "Diga se é estudante ou visitante, informe os dados e escolha as atividades.",
  },
  { titulo: "Receba a confirmação", texto: "Ao enviar, a confirmação aparece na tela com as atividades escolhidas." },
];

export default function ComoParticipar() {
  return (
    <section id="participar" className="section participar">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Como participar</p>
          <h2>Inscrição em três passos</h2>
        </div>
        <ol className="steps">
          {passos.map((passo, i) => (
            <li key={passo.titulo}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </li>
          ))}
        </ol>
        <div className="participar-acao">
          <LinkInscricao className="btn btn-light">Ir para o formulário</LinkInscricao>
          <p className="participar-comprovante">
            Já se inscreveu? <Link href="/comprovante">Baixe o comprovante de novo</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
