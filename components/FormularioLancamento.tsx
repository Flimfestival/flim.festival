"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { enviarLancamento } from "@/app/lancamento-de-livros/actions";
import {
  lancamento,
  tamanhos,
  UFS,
  type CampoLancamento,
  type ErrosLancamento,
  type EstadoLancamento,
} from "@/lib/lancamento";

const estadoInicial: EstadoLancamento = { status: "inicial" };

export default function FormularioLancamento() {
  // Trocar a `key` recria o formulário vazio, para inscrever outro livro.
  const [rodada, setRodada] = useState(0);
  return <Formulario key={rodada} aoRecomecar={() => setRodada((r) => r + 1)} />;
}

function Formulario({ aoRecomecar }: { aoRecomecar: () => void }) {
  const [estado, acao, enviando] = useActionState(enviarLancamento, estadoInicial);
  const alerta = useRef<HTMLDivElement>(null);
  const confirmacao = useRef<HTMLHeadingElement>(null);

  // Leva o foco ao aviso de erro ou à confirmação, para quem usa teclado ou leitor de tela.
  useEffect(() => {
    if (estado.status === "erro") alerta.current?.focus();
    if (estado.status === "recebida") confirmacao.current?.focus();
  }, [estado]);

  if (estado.status === "recebida") {
    const enviado = estado.valores;
    return (
      <div className="form-card confirmacao">
        <p className="eyebrow eyebrow-green">Lançamento de livros</p>
        <h2 ref={confirmacao} tabIndex={-1}>
          Inscrição recebida!
        </h2>
        <p>{lancamento.confirmacao}</p>
        <dl className="comprovante-dados">
          <div>
            <dt>Livro</dt>
            <dd>{enviado.titulo}</dd>
          </div>
          <div>
            <dt>Autor</dt>
            <dd>{enviado.autor}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{enviado.email}</dd>
          </div>
          <div>
            <dt>WhatsApp</dt>
            <dd>{enviado.whatsapp}</dd>
          </div>
        </dl>
        <div className="actions">
          <button type="button" className="btn btn-outline" onClick={aoRecomecar}>
            Inscrever outro livro
          </button>
          <Link href="/" className="btn btn-outline">
            Voltar para o site
          </Link>
        </div>
      </div>
    );
  }

  const valores = estado.status === "erro" ? estado.valores : undefined;
  const erros: ErrosLancamento = estado.status === "erro" ? estado.erros : {};
  const descricao = (campo: CampoLancamento, dica?: string) =>
    [dica, erros[campo] ? `erro-${campo}` : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <form action={acao} className="form-card">
      {estado.status === "erro" && (
        <div ref={alerta} tabIndex={-1} role="alert" className="form-alerta">
          {estado.mensagem}
        </div>
      )}
      <p className="dica">Todos os campos são obrigatórios.</p>

      <fieldset className="form-grupo">
        <legend>Autor</legend>
        <div className="campos">
          <div className="campo campo-largo">
            <label htmlFor="autor">Nome do autor</label>
            <input
              id="autor"
              name="autor"
              type="text"
              autoComplete="name"
              required
              minLength={3}
              maxLength={tamanhos.autor}
              defaultValue={valores?.autor}
              aria-invalid={Boolean(erros.autor)}
              aria-describedby={descricao("autor")}
            />
            <MensagemErro campo="autor" erros={erros} />
          </div>
          <div className="campo">
            <label htmlFor="cidade">Cidade</label>
            <input
              id="cidade"
              name="cidade"
              type="text"
              autoComplete="address-level2"
              required
              minLength={2}
              maxLength={tamanhos.cidade}
              defaultValue={valores?.cidade}
              aria-invalid={Boolean(erros.cidade)}
              aria-describedby={descricao("cidade")}
            />
            <MensagemErro campo="cidade" erros={erros} />
          </div>
          <div className="campo">
            <label htmlFor="uf">UF</label>
            {/* A `key` recria o select com o valor enviado depois de um erro. */}
            <select
              key={valores?.uf ?? "vazio"}
              id="uf"
              name="uf"
              autoComplete="address-level1"
              required
              defaultValue={valores?.uf ?? ""}
              aria-invalid={Boolean(erros.uf)}
              aria-describedby={descricao("uf")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            <MensagemErro campo="uf" erros={erros} />
          </div>
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              defaultValue={valores?.email}
              aria-invalid={Boolean(erros.email)}
              aria-describedby={descricao("email")}
            />
            <MensagemErro campo="email" erros={erros} />
          </div>
          <div className="campo">
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              maxLength={20}
              placeholder="(84) 99999-9999"
              defaultValue={valores?.whatsapp}
              aria-invalid={Boolean(erros.whatsapp)}
              aria-describedby={descricao("whatsapp")}
            />
            <MensagemErro campo="whatsapp" erros={erros} />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-grupo">
        <legend>Livro</legend>
        <div className="campos">
          <div className="campo campo-largo">
            <label htmlFor="titulo">Título do livro</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              autoComplete="off"
              required
              maxLength={tamanhos.titulo}
              defaultValue={valores?.titulo}
              aria-invalid={Boolean(erros.titulo)}
              aria-describedby={descricao("titulo")}
            />
            <MensagemErro campo="titulo" erros={erros} />
          </div>
          <div className="campo campo-largo">
            <label htmlFor="apresentacao">Breve apresentação do livro</label>
            <textarea
              id="apresentacao"
              name="apresentacao"
              rows={5}
              required
              minLength={20}
              maxLength={tamanhos.apresentacao}
              defaultValue={valores?.apresentacao}
              aria-invalid={Boolean(erros.apresentacao)}
              aria-describedby={descricao("apresentacao", "dica-apresentacao")}
            />
            <p id="dica-apresentacao" className="dica">
              Gênero, tema e para quem é o livro. Até {tamanhos.apresentacao.toLocaleString("pt-BR")} caracteres.
            </p>
            <MensagemErro campo="apresentacao" erros={erros} />
          </div>
          <div className="campo campo-largo">
            <label htmlFor="minibiografia">Minibiografia</label>
            <textarea
              id="minibiografia"
              name="minibiografia"
              rows={4}
              required
              minLength={20}
              maxLength={tamanhos.minibiografia}
              defaultValue={valores?.minibiografia}
              aria-invalid={Boolean(erros.minibiografia)}
              aria-describedby={descricao("minibiografia", "dica-minibiografia")}
            />
            <p id="dica-minibiografia" className="dica">
              Quem é você como autor, em poucas linhas. Até {tamanhos.minibiografia} caracteres.
            </p>
            <MensagemErro campo="minibiografia" erros={erros} />
          </div>
        </div>
      </fieldset>

      <div className="form-grupo">
        <label className="opcao consentimento">
          <input
            type="checkbox"
            name="consentimento"
            value="sim"
            required
            defaultChecked={valores?.consentimento}
            aria-invalid={Boolean(erros.consentimento)}
            aria-describedby={descricao("consentimento")}
          />
          <span>
            Autorizo a organização do FLIM a usar estes dados para entrar em contato sobre o lançamento e a
            divulgar o nome do autor, o título, a apresentação do livro e a minibiografia nos materiais do
            festival.
          </span>
        </label>
        <MensagemErro campo="consentimento" erros={erros} />
      </div>

      {/* Armadilha para robôs: fica fora da tela e pessoas não preenchem. */}
      <div className="campo-oculto" aria-hidden="true">
        <label htmlFor="campo_extra">Deixe este campo em branco</label>
        <input id="campo_extra" name="campo_extra" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-primary form-enviar" disabled={enviando}>
        {enviando ? "Enviando…" : "Enviar inscrição"}
      </button>
    </form>
  );
}

function MensagemErro({ campo, erros }: { campo: CampoLancamento; erros: ErrosLancamento }) {
  if (!erros[campo]) return null;
  return (
    <p id={`erro-${campo}`} className="erro-campo">
      {erros[campo]}
    </p>
  );
}
