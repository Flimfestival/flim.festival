"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { consultarInscricao, type CampoConsulta, type EstadoConsulta } from "@/app/comprovante/actions";
import Comprovante from "@/components/Comprovante";
import { idade } from "@/lib/inscricao";

const estadoInicial: EstadoConsulta = { status: "inicial" };

export default function ConsultaComprovante() {
  // Trocar a `key` volta à busca vazia, para procurar outra inscrição.
  const [rodada, setRodada] = useState(0);
  return <Consulta key={rodada} aoRecomecar={() => setRodada((r) => r + 1)} />;
}

function Consulta({ aoRecomecar }: { aoRecomecar: () => void }) {
  const [estado, acao, buscando] = useActionState(consultarInscricao, estadoInicial);
  const [dataNascimento, setDataNascimento] = useState("");
  const alerta = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);

  // Leva o foco ao aviso ou ao comprovante encontrado, para quem usa teclado ou leitor de tela.
  useEffect(() => {
    if (estado.status === "erro") alerta.current?.focus();
    if (estado.status === "encontrada") titulo.current?.focus();
  }, [estado]);

  if (estado.status === "encontrada") {
    const ultima = estado.inscricoes.length - 1;
    return estado.inscricoes.map((inscricao, i) => (
      <Comprovante
        key={`${inscricao.nome}-${inscricao.escola}-${i}`}
        inscricao={inscricao}
        refTitulo={i === 0 ? titulo : undefined}
        apresentacao={
          <p>
            A inscrição de <strong>{inscricao.nome}</strong> no FLIM está registrada.
          </p>
        }
        acoes={
          i === ultima && (
            <>
              <button type="button" className="btn btn-outline" onClick={aoRecomecar}>
                Buscar outra inscrição
              </button>
              <Link href="/" className="btn btn-outline">
                Voltar para o site
              </Link>
            </>
          )
        }
      />
    ));
  }

  const valores = estado.status === "erro" ? estado.valores : undefined;
  const erros = estado.status === "erro" ? estado.erros : {};
  const anos = idade(dataNascimento || valores?.dataNascimento || "");
  const menor = anos !== null && anos < 18;
  const descricao = (campo: CampoConsulta) => (erros[campo] ? `erro-${campo}` : undefined);

  return (
    <form action={acao} className="form-card">
      {estado.status === "erro" && (
        <div ref={alerta} tabIndex={-1} role="alert" className="form-alerta">
          {estado.mensagem}
        </div>
      )}
      <p className="dica">Preencha como na inscrição. Acentos e letras maiúsculas não fazem diferença.</p>

      <fieldset className="form-grupo">
        <legend>Dados do participante</legend>
        <div className="campos">
          <div className="campo campo-largo">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              required
              minLength={3}
              maxLength={120}
              defaultValue={valores?.nome}
              aria-invalid={Boolean(erros.nome)}
              aria-describedby={descricao("nome")}
            />
            <MensagemErro campo="nome" erros={erros} />
          </div>
          <div className="campo">
            <label htmlFor="dataNascimento">Data de nascimento</label>
            <input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              autoComplete="bday"
              required
              min="1900-01-01"
              defaultValue={valores?.dataNascimento}
              onChange={(evento) => setDataNascimento(evento.target.value)}
              aria-invalid={Boolean(erros.dataNascimento)}
              aria-describedby={descricao("dataNascimento")}
            />
            <MensagemErro campo="dataNascimento" erros={erros} />
          </div>
          {menor && (
            <div className="campo">
              <label htmlFor="responsavelCpf">CPF do responsável legal</label>
              <input
                id="responsavelCpf"
                name="responsavelCpf"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                required
                maxLength={14}
                placeholder="000.000.000-00"
                defaultValue={valores?.responsavelCpf}
                aria-invalid={Boolean(erros.responsavelCpf)}
                aria-describedby={["dica-cpf", descricao("responsavelCpf")].filter(Boolean).join(" ")}
              />
              <p id="dica-cpf" className="dica">
                O mesmo informado na inscrição, para proteger os dados de menores de idade.
              </p>
              <MensagemErro campo="responsavelCpf" erros={erros} />
            </div>
          )}
        </div>
      </fieldset>

      <button type="submit" className="btn btn-primary form-enviar" disabled={buscando}>
        {buscando ? "Buscando…" : "Buscar inscrição"}
      </button>
    </form>
  );
}

function MensagemErro({ campo, erros }: { campo: CampoConsulta; erros: Partial<Record<CampoConsulta, string>> }) {
  if (!erros[campo]) return null;
  return (
    <p id={`erro-${campo}`} className="erro-campo">
      {erros[campo]}
    </p>
  );
}
