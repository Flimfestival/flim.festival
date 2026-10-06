"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  carregarAtividade,
  desfazerEntrada,
  registrarEntrada,
  type DadosAtividade,
  type Estudante,
} from "@/app/portaria/actions";

type Opcao = { id: string; titulo: string; rotulo: string };

// Busca sem diferenciar acentos, maiúsculas e espaços repetidos ("joao" encontra "João").
const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

const formatarHora = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Fortaleza" });

const formatarData = (iso: string) => iso.split("-").reverse().join("/");

export default function PainelPortaria({
  atividades,
  inicial,
}: {
  atividades: Opcao[];
  // Inscritos da primeira atividade, já carregados pelo servidor junto com a página.
  inicial: DadosAtividade | { erro: string };
}) {
  const [atividade, setAtividade] = useState(atividades[0].id);
  const [dados, setDados] = useState<DadosAtividade | null>("erro" in inicial ? null : inicial);
  const [erro, setErro] = useState("erro" in inicial ? inicial.erro : "");
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState("");
  const [salvando, setSalvando] = useState<string | null>(null);
  const campoBusca = useRef<HTMLInputElement>(null);

  const carregar = useCallback(async (id: string) => {
    const resposta = await carregarAtividade(id);
    if ("erro" in resposta) {
      setErro(resposta.erro);
    } else {
      setErro("");
      setDados(resposta);
    }
  }, []);

  // Atualiza presenças e vagas a cada minuto.
  useEffect(() => {
    const intervalo = setInterval(() => void carregar(atividade), 60_000);
    return () => clearInterval(intervalo);
  }, [atividade, carregar]);

  const titulos = useMemo(() => new Map(atividades.map((opcao) => [opcao.id, opcao.titulo])), [atividades]);

  const indice = useMemo(
    () => (dados?.estudantes ?? []).map((estudante) => ({ estudante, chave: normalizar(estudante.nome) })),
    [dados],
  );

  const termo = normalizar(busca);
  const resultados = useMemo(() => {
    if (termo.length < 2) return [];
    const partes = termo.split(" ");
    return indice
      .filter(({ chave }) => partes.every((parte) => chave.includes(parte)))
      .map(({ estudante }) => estudante)
      .sort(
        (a, b) =>
          Number(b.atividades.includes(atividade)) - Number(a.atividades.includes(atividade)) ||
          a.nome.localeCompare(b.nome, "pt-BR"),
      )
      .slice(0, 30);
  }, [indice, termo, atividade]);

  const inscritos = dados?.estudantes.filter((estudante) => estudante.atividades.includes(atividade)).length ?? 0;
  const presentes = dados ? Object.keys(dados.presencas).length : 0;

  function trocarAtividade(id: string) {
    setAtividade(id);
    setDados(null);
    setBusca("");
    setAviso("");
    void carregar(id);
  }

  async function registrar(estudante: Estudante) {
    setSalvando(estudante.id);
    const resposta = await registrarEntrada(estudante.id, atividade);
    setSalvando(null);
    if ("erro" in resposta) {
      setAviso(resposta.erro);
      return;
    }
    setDados((atual) =>
      atual && { ...atual, presencas: { ...atual.presencas, [estudante.id]: resposta.hora } },
    );
    setAviso(
      resposta.nova
        ? `Entrada de ${estudante.nome} registrada.`
        : `${estudante.nome} já tinha entrada registrada às ${formatarHora(resposta.hora)}.`,
    );
    setBusca("");
    campoBusca.current?.focus();
  }

  async function desfazer(estudante: Estudante) {
    if (!window.confirm(`Desfazer a entrada de ${estudante.nome}?`)) return;
    setSalvando(estudante.id);
    const resposta = await desfazerEntrada(estudante.id, atividade);
    setSalvando(null);
    if ("erro" in resposta) {
      setAviso(resposta.erro);
      return;
    }
    setDados((atual) => {
      if (!atual) return atual;
      const presencas = { ...atual.presencas };
      delete presencas[estudante.id];
      return { ...atual, presencas };
    });
    setAviso(`Entrada de ${estudante.nome} desfeita.`);
  }

  const vagas = dados?.vagasRestantes;
  const avisoVagas =
    vagas === undefined
      ? ""
      : vagas === null
        ? "Esta atividade não tem limite de vagas: quem não se inscreveu pode se inscrever pelo site."
        : vagas > 0
          ? `Ainda há ${vagas} ${vagas === 1 ? "vaga" : "vagas"}: quem não se inscreveu pode se inscrever pelo site.`
          : "As vagas desta atividade estão esgotadas.";

  return (
    <div className="painel">
      <div className="campo">
        <label htmlFor="atividade">Atividade</label>
        <select id="atividade" value={atividade} onChange={(evento) => trocarAtividade(evento.target.value)}>
          {atividades.map((opcao) => (
            <option key={opcao.id} value={opcao.id}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      {erro && (
        <p role="alert" className="form-alerta">
          {erro}
        </p>
      )}

      <dl className="painel-contadores" aria-live="polite">
        <div>
          <dt>Inscritos</dt>
          <dd>{dados ? inscritos : "…"}</dd>
        </div>
        <div>
          <dt>Presentes</dt>
          <dd>{dados ? presentes : "…"}</dd>
        </div>
        <div>
          <dt>Vagas restantes</dt>
          <dd>{vagas === undefined ? "…" : vagas === null ? "Sem limite" : vagas}</dd>
        </div>
      </dl>

      <div className="campo">
        <label htmlFor="busca">Nome do estudante</label>
        <input
          ref={campoBusca}
          id="busca"
          type="search"
          autoComplete="off"
          autoFocus
          placeholder="Digite parte do nome"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          disabled={!dados}
        />
      </div>

      <p className="painel-aviso" role="status">
        {aviso}
      </p>

      {termo.length >= 2 && dados && resultados.length === 0 && (
        <div className="resultado resultado-ausente">
          <p className="resultado-nome">Nenhum inscrito com esse nome.</p>
          <p className="resultado-info">{avisoVagas}</p>
        </div>
      )}

      <ul className="resultados">
        {resultados.map((estudante) => {
          const nestaAtividade = estudante.atividades.includes(atividade);
          const entrada = dados?.presencas[estudante.id];
          const situacao = !nestaAtividade ? "resultado-outra" : entrada ? "resultado-presente" : "resultado-inscrito";
          return (
            <li key={estudante.id} className={`resultado ${situacao}`}>
              <div className="resultado-dados">
                <p className="resultado-nome">{estudante.nome}</p>
                <p className="resultado-info">
                  {estudante.escola} · {estudante.anoEscolar} · nascimento {formatarData(estudante.dataNascimento)}
                </p>
                <p className="resultado-situacao">
                  {!nestaAtividade
                    ? `Inscrição em outra atividade: ${estudante.atividades.map((id) => titulos.get(id) ?? id).join("; ")}`
                    : entrada
                      ? `Entrada registrada às ${formatarHora(entrada)}`
                      : "Inscrição nesta atividade"}
                </p>
              </div>
              {nestaAtividade && !entrada && (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={salvando === estudante.id}
                  onClick={() => registrar(estudante)}
                >
                  {salvando === estudante.id ? "Registrando…" : "Registrar entrada"}
                </button>
              )}
              {nestaAtividade && entrada && (
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={salvando === estudante.id}
                  onClick={() => desfazer(estudante)}
                >
                  Desfazer
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {dados && <p className="dica painel-rodape">{avisoVagas}</p>}
    </div>
  );
}
