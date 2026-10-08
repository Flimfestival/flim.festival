import { evento } from "@/lib/evento";

const perguntas = [
  {
    pergunta: "A participação é gratuita?",
    resposta:
      "Sim. Todas as atividades são gratuitas. Para a abertura, com palestra de Bráulio Bessa, pede-se a contribuição de 2 kg de alimentos.",
  },
  {
    pergunta: "As vagas são limitadas?",
    resposta:
      "Sim. A abertura tem 600 vagas, cada painel na Casa de Cultura tem 110 e cada oficina tem 25. As vagas são preenchidas por ordem de inscrição, e o formulário mostra quantas ainda restam.",
  },
  {
    pergunta: "Haverá certificado de participação?",
    resposta:
      "Sim. Participantes inscritos nas oficinas e nos painéis receberão certificado, conforme a frequência registrada.",
  },
  {
    pergunta: "Escolas podem inscrever turmas?",
    resposta:
      "Sim. Cada estudante precisa de uma inscrição própria, com o nome da escola e o ano escolar. A escola ou o responsável pode preencher o formulário pelo estudante.",
  },
  {
    pergunta: "Perdi o comprovante. Como baixo de novo?",
    resposta:
      "Na página Comprovante (www.festivalflim.com.br/comprovante), informe o nome completo e a data de nascimento do participante, como foram preenchidos na inscrição. Para menores de 18 anos, informe também o CPF do responsável legal.",
  },
  {
    pergunta: "Quem pode participar?",
    resposta:
      "Estudantes e visitantes: famílias, professores, bibliotecários, escritores e toda a comunidade de Martins e região. Abertura, painéis, palestra e oficinas são abertos a todos; só o concurso de redação é exclusivo para estudantes das escolas de Martins.",
  },
];

export default function Duvidas() {
  return (
    <section id="duvidas" className="section section-tint">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow eyebrow-blue">Dúvidas frequentes</p>
          <h2>Perguntas e respostas</h2>
          <p className="intro">
            Não encontrou o que procurava? Escreva para{" "}
            <a href={`mailto:${evento.emailContato}`}>{evento.emailContato}</a>.
          </p>
        </div>
        <div className="faq">
          {perguntas.map((item) => (
            <details key={item.pergunta}>
              <summary>{item.pergunta}</summary>
              <p>{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
