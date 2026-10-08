"use client";

import type { ReactNode, Ref } from "react";
import BaixarComprovante from "@/components/BaixarComprovante";
import { evento } from "@/lib/evento";
import { categoriaRedacao, type Valores } from "@/lib/inscricao";
import { atividadesInscricao } from "@/lib/programacao";

/*
 * Comprovante de inscrição: aparece logo depois do envio do formulário e na página /comprovante,
 * quando a pessoa busca a inscrição de novo. `apresentacao` é o texto do topo e `acoes`, os botões
 * que vêm depois de "Baixar comprovante".
 */
export default function Comprovante({
  inscricao,
  apresentacao,
  acoes,
  refTitulo,
}: {
  inscricao: Valores;
  apresentacao: ReactNode;
  acoes?: ReactNode;
  refTitulo?: Ref<HTMLHeadingElement>;
}) {
  const visitante = inscricao.perfil === "visitante";
  const escolhidas = atividadesInscricao.filter((atividade) => inscricao.atividades.includes(atividade.id));
  const categoria = categoriaRedacao(inscricao.anoEscolar);

  return (
    <div className="form-card confirmacao comprovante">
      <p className="eyebrow eyebrow-green">Comprovante de inscrição</p>
      <h2 ref={refTitulo} tabIndex={-1}>
        Inscrição confirmada
      </h2>
      {apresentacao}
      <dl className="comprovante-dados">
        <div>
          <dt>{visitante ? "Visitante" : "Estudante"}</dt>
          <dd>{inscricao.nome}</dd>
        </div>
        <div>
          <dt>Nascimento</dt>
          <dd>{inscricao.dataNascimento.split("-").reverse().join("/")}</dd>
        </div>
        {!visitante && (
          <>
            <div>
              <dt>Escola</dt>
              <dd>{inscricao.escola}</dd>
            </div>
            <div>
              <dt>Ano escolar</dt>
              <dd>{inscricao.anoEscolar}</dd>
            </div>
          </>
        )}
        {inscricao.responsavelNome && (
          <div>
            <dt>Responsável legal</dt>
            <dd>{inscricao.responsavelNome}</dd>
          </div>
        )}
      </dl>
      <h3>Atividades</h3>
      <ul className="comprovante-atividades">
        {escolhidas.map((atividade) => (
          <li key={atividade.id}>
            <strong>{atividade.titulo}</strong>
            <span>
              {atividade.grupo} · {atividade.quando}
            </span>
          </li>
        ))}
      </ul>
      <div className="comprovante-orientacao">
        <p>
          <strong>Na entrada de cada atividade, diga o nome completo do participante à comissão.</strong> Não
          é preciso imprimir este comprovante, mas vale guardar: use o botão “Baixar comprovante” ou tire um
          print desta tela.
        </p>
        {inscricao.atividades.includes("abertura") && <p>Na abertura, leve 2 kg de alimentos.</p>}
        {inscricao.atividades.includes("concurso-redacao") && categoria && (
          <p>
            Concurso de redação: categoria {categoria}. O cortejo das 8h, saindo da Igreja do Rosário,
            é obrigatório. Leve caneta azul ou preta de corpo transparente. Regras no{" "}
            <a href={evento.edital} target="_blank" rel="noopener">
              edital do concurso
            </a>
            .
          </p>
        )}
        <p>Termo de consentimento, participação e uso de imagem e voz: aceito.</p>
      </div>
      {inscricao.email && (
        <p>
          E-mail informado: <strong>{inscricao.email}</strong>
        </p>
      )}
      <p>
        Dúvidas: <a href={`mailto:${evento.emailContato}`}>{evento.emailContato}</a>
      </p>
      <div className="actions">
        <BaixarComprovante inscricao={inscricao} />
        {acoes}
      </div>
    </div>
  );
}
