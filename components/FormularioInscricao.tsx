"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { enviarInscricao } from "@/app/inscricao/actions";
import { evento } from "@/lib/evento";
import {
  anosDaEscola,
  ATIVIDADE_ATIPICOS,
  ATIVIDADES_MUNICIPIO,
  AVISO_MUNICIPIO,
  categoriaRedacao,
  escolas,
  idade,
  OUTRA_ESCOLA,
  tituloAtividade,
  podeParticipar,
  restricoesPorAno,
  type Campo,
  type Erros,
  type EstadoInscricao,
  type VagasRestantes,
} from "@/lib/inscricao";
import { atividadesInscricao, simultaneas } from "@/lib/programacao";
import { termo } from "@/lib/termo";

const estadoInicial: EstadoInscricao = { status: "inicial" };

// Atividades agrupadas por dia ou local, na ordem do cronograma.
const grupos = [...new Set(atividadesInscricao.map((atividade) => atividade.grupo))].map((grupo) => ({
  titulo: grupo,
  atividades: atividadesInscricao.filter((atividade) => atividade.grupo === grupo),
}));

export default function FormularioInscricao({ vagas }: { vagas: VagasRestantes | null }) {
  // Trocar a `key` recria o formulário do zero para uma nova inscrição.
  const [rodada, setRodada] = useState(0);
  return <Formulario key={rodada} vagas={vagas} aoRecomecar={() => setRodada((r) => r + 1)} />;
}

function Formulario({ vagas, aoRecomecar }: { vagas: VagasRestantes | null; aoRecomecar: () => void }) {
  const [estado, acao, enviando] = useActionState(enviarInscricao, estadoInicial);
  const valores = estado.status === "erro" ? estado.valores : undefined;
  const erros: Erros = estado.status === "erro" ? estado.erros : {};
  const [anoEscolar, setAnoEscolar] = useState("");
  const [deficiencia, setDeficiencia] = useState("");
  const [escolaOpcao, setEscolaOpcao] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  // Atividades marcadas agora, para desativar as que acontecem no mesmo horário.
  const [marcadas, setMarcadas] = useState<string[]>([]);
  const [atipico, setAtipico] = useState(false);
  // Depois de um envio com erro, o formulário volta com as atividades que foram enviadas.
  const [estadoVisto, setEstadoVisto] = useState(estado);
  if (estado !== estadoVisto) {
    setEstadoVisto(estado);
    setMarcadas(estado.status === "erro" ? estado.valores.atividades : []);
    setAtipico(estado.status === "erro" ? estado.valores.atipico : false);
  }
  const alerta = useRef<HTMLDivElement>(null);
  const confirmacao = useRef<HTMLHeadingElement>(null);

  // Leva o foco ao aviso de erro ou à confirmação, para quem usa teclado ou leitor de tela.
  useEffect(() => {
    if (estado.status === "erro") alerta.current?.focus();
    if (estado.status === "enviada") confirmacao.current?.focus();
  }, [estado]);

  if (estado.status === "enviada") {
    const inscricao = estado.valores;
    const escolhidas = atividadesInscricao.filter((atividade) => inscricao.atividades.includes(atividade.id));
    const categoria = categoriaRedacao(inscricao.anoEscolar);
    return (
      <div className="form-card confirmacao comprovante">
        <p className="eyebrow eyebrow-green">Comprovante de inscrição</p>
        <h2 ref={confirmacao} tabIndex={-1}>
          Inscrição confirmada
        </h2>
        {estado.acrescentadas.length > 0 ? (
          <div className="comprovante-orientacao">
            <p>
              <strong>{inscricao.nome}</strong> já tinha inscrição no FLIM. Acrescentamos:{" "}
              {estado.acrescentadas.map(tituloAtividade).join("; ")}.
            </p>
            {estado.repetidas.length > 0 && (
              <p>Já tinha inscrição em: {estado.repetidas.map(tituloAtividade).join("; ")}.</p>
            )}
            <p>
              Os dados de ano escolar e e-mail são os da primeira inscrição. Se esta inscrição não é
              deste estudante, escreva para {evento.emailContato}.
            </p>
          </div>
        ) : (
          <p>
            A inscrição de <strong>{inscricao.nome}</strong> no FLIM foi registrada.
          </p>
        )}
        <dl className="comprovante-dados">
          <div>
            <dt>Estudante</dt>
            <dd>{inscricao.nome}</dd>
          </div>
          <div>
            <dt>Nascimento</dt>
            <dd>{inscricao.dataNascimento.split("-").reverse().join("/")}</dd>
          </div>
          <div>
            <dt>Escola</dt>
            <dd>{inscricao.escola}</dd>
          </div>
          <div>
            <dt>Ano escolar</dt>
            <dd>{inscricao.anoEscolar}</dd>
          </div>
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
            <strong>Na entrada de cada atividade, diga o nome completo do estudante à comissão.</strong> Não
            é preciso imprimir este comprovante, mas vale guardar.
          </p>
          {inscricao.atividades.includes("abertura") && <p>Na abertura, leve 2 kg de alimentos.</p>}
          {inscricao.atividades.includes("concurso-redacao") && categoria && (
            <p>Concurso de redação: categoria {categoria}.</p>
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
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Salvar ou imprimir
          </button>
          <button type="button" className="btn btn-outline" onClick={aoRecomecar}>
            Fazer outra inscrição
          </button>
          <Link href="/" className="btn btn-outline">
            Voltar para o site
          </Link>
        </div>
      </div>
    );
  }

  const esgotadasAgora = estado.status === "erro" ? (estado.esgotadas ?? []) : [];
  const descricao = (campo: Campo, dica?: string) =>
    [dica, erros[campo] ? `erro-${campo}` : undefined].filter(Boolean).join(" ") || undefined;
  const categoria = categoriaRedacao(anoEscolar);
  const anosParticipante = idade(dataNascimento || valores?.dataNascimento || "");
  const menorDeIdade = anosParticipante !== null && anosParticipante < 18;
  const escolaEscolhida = escolas.find((escola) => escola.nome === escolaOpcao);
  const anosPermitidos = anosDaEscola(escolaOpcao);

  return (
    <form action={acao} className="form-card">
      {estado.status === "erro" && (
        <div ref={alerta} tabIndex={-1} role="alert" className="form-alerta">
          {estado.mensagem}
        </div>
      )}
      <p className="dica">Todos os campos são obrigatórios, exceto os marcados como opcionais.</p>

      <fieldset className="form-grupo">
        <legend>Dados do estudante</legend>
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
          <div className="campo">
            <label htmlFor="email">
              E-mail <span className="opcional">(opcional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              defaultValue={valores?.email}
              aria-invalid={Boolean(erros.email)}
              aria-describedby={descricao("email")}
            />
            <MensagemErro campo="email" erros={erros} />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-grupo">
        <legend>Dados escolares</legend>
        <div className="campos">
          <div className="campo campo-largo">
            <label htmlFor="escola">Escola</label>
            {/* A `key` recria o select com o valor enviado depois de um erro (veja o ano escolar). */}
            <select
              key={valores ? `${valores.escolaOutra}-${valores.escola}` : "vazio"}
              id="escola"
              name="escola"
              required
              defaultValue={valores ? (valores.escolaOutra ? OUTRA_ESCOLA : valores.escola) : ""}
              onChange={(evento) => {
                const escola = evento.target.value;
                setEscolaOpcao(escola);
                // Estudantes de fora de Martins não podem ficar nas atividades só do município.
                if (escola === OUTRA_ESCOLA) {
                  setMarcadas((atuais) => atuais.filter((id) => !ATIVIDADES_MUNICIPIO.includes(id)));
                }
                // Se a nova escola não oferece o ano já escolhido, o ano volta a "Selecione".
                if (anoEscolar && !anosDaEscola(escola).includes(anoEscolar)) setAnoEscolar("");
              }}
              aria-invalid={Boolean(erros.escola)}
              aria-describedby={descricao("escola")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {escolas.map((escola) => (
                <option key={escola.nome} value={escola.nome}>
                  {escola.rotulo ?? escola.nome}
                </option>
              ))}
              <option value={OUTRA_ESCOLA}>Outra escola</option>
            </select>
            {escolaOpcao !== OUTRA_ESCOLA && <MensagemErro campo="escola" erros={erros} />}
          </div>
          {escolaOpcao === OUTRA_ESCOLA && (
            <div className="campo campo-largo">
              <label htmlFor="escolaOutra">Nome da escola</label>
              <input
                id="escolaOutra"
                name="escolaOutra"
                type="text"
                required
                minLength={2}
                maxLength={160}
                defaultValue={valores?.escolaOutra ? valores.escola : undefined}
                aria-invalid={Boolean(erros.escola)}
                aria-describedby={descricao("escola")}
              />
              <MensagemErro campo="escola" erros={erros} />
            </div>
          )}
          <div className="campo campo-largo">
            <label htmlFor="anoEscolar">Ano escolar</label>
            {/* O React só aplica o valor padrão de um select ao montá-lo; a `key` o recria quando a
                escola muda ou depois de um erro, já com o ano certo. */}
            <select
              key={`${escolaOpcao}-${valores?.anoEscolar ?? "vazio"}`}
              id="anoEscolar"
              name="anoEscolar"
              required
              defaultValue={anosPermitidos.includes(anoEscolar) ? anoEscolar : (valores?.anoEscolar ?? "")}
              onChange={(evento) => {
                const ano = evento.target.value;
                setAnoEscolar(ano);
                // Desmarca as atividades que o novo ano escolar não pode fazer.
                setMarcadas((atuais) => atuais.filter((id) => podeParticipar(id, ano)));
              }}
              aria-invalid={Boolean(erros.anoEscolar)}
              aria-describedby={descricao("anoEscolar")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {["Ensino Fundamental", "Ensino Médio"].map((etapa) => {
                const anos = anosPermitidos.filter((ano) => ano.endsWith(etapa));
                return (
                  anos.length > 0 && (
                    <optgroup key={etapa} label={etapa}>
                      {anos.map((ano) => (
                        <option key={ano} value={ano}>
                          {ano}
                        </option>
                      ))}
                    </optgroup>
                  )
                );
              })}
            </select>
            {escolaEscolhida?.etapas && (
              <p className="dica">Anos oferecidos pela escola: {escolaEscolhida.etapas}.</p>
            )}
            <MensagemErro campo="anoEscolar" erros={erros} />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-grupo" aria-describedby={descricao("deficiencia")}>
        <legend>Possui alguma deficiência?</legend>
        <p className="dica">
          Essa informação é usada só para garantir acessibilidade e apoio nas atividades, como prevê o
          termo de consentimento.
        </p>
        <div className="opcoes">
          {[
            { valor: "sim", rotulo: "Sim" },
            { valor: "nao", rotulo: "Não" },
          ].map((opcao) => (
            <label key={opcao.valor} className="opcao">
              <input
                type="radio"
                name="deficiencia"
                value={opcao.valor}
                required
                defaultChecked={valores?.deficiencia === opcao.valor}
                onChange={() => setDeficiencia(opcao.valor)}
              />
              <span>{opcao.rotulo}</span>
            </label>
          ))}
        </div>
        <MensagemErro campo="deficiencia" erros={erros} />
        {deficiencia === "sim" && (
          <div className="campo campo-extra">
            <label htmlFor="qualDeficiencia">
              Qual? Conte também se o estudante precisa de algum apoio para participar.{" "}
              <span className="opcional">(opcional)</span>
            </label>
            <textarea
              id="qualDeficiencia"
              name="qualDeficiencia"
              rows={3}
              maxLength={500}
              defaultValue={valores?.qualDeficiencia}
              aria-invalid={Boolean(erros.qualDeficiencia)}
              aria-describedby={descricao("qualDeficiencia")}
            />
            <MensagemErro campo="qualDeficiencia" erros={erros} />
          </div>
        )}
        <label className="opcao campo-extra">
          <input
            type="checkbox"
            name="atipico"
            value="sim"
            // Valor inicial (e não controlado): depois de um envio, o formulário volta a este valor,
            // que acompanha o que foi enviado.
            defaultChecked={atipico}
            onChange={(evento) => {
              setAtipico(evento.target.checked);
              // Sem a marcação, a oficina exclusiva deixa de estar escolhida.
              if (!evento.target.checked) {
                setMarcadas((atuais) => atuais.filter((id) => id !== ATIVIDADE_ATIPICOS));
              }
            }}
          />
          <span>
            O estudante é uma criança atípica (neurodivergente), por exemplo com autismo (TEA), TDAH
            ou outra condição do neurodesenvolvimento.
            <small>Libera a oficina de desenho criativo, exclusiva para crianças atípicas.</small>
          </span>
        </label>
      </fieldset>

      <fieldset className="form-grupo" aria-describedby={descricao("atividades", "dica-atividades")}>
        <legend>Atividades</legend>
        <p id="dica-atividades" className="dica">
          Marque as atividades de que o estudante quer participar. Algumas têm vagas limitadas.
        </p>
        {grupos.map((grupo) => (
          <fieldset key={grupo.titulo} className="grupo-atividades">
            <legend>{grupo.titulo}</legend>
            <div className="opcoes opcoes-atividades">
              {grupo.atividades.map((atividade) => {
                const restantes = vagas?.[atividade.id];
                const esgotada = restantes === 0 || esgotadasAgora.includes(atividade.id);
                const foraDoAno = !podeParticipar(atividade.id, anoEscolar);
                const mesmoHorario = marcadas.includes(atividade.id)
                  ? []
                  : simultaneas(atividade.id).filter((id) => marcadas.includes(id));
                const soAtipicos = atividade.id === ATIVIDADE_ATIPICOS && !atipico;
                const soMunicipio =
                  escolaOpcao === OUTRA_ESCOLA && ATIVIDADES_MUNICIPIO.includes(atividade.id);
                const bloqueada =
                  esgotada || foraDoAno || soAtipicos || soMunicipio || mesmoHorario.length > 0;
                return (
                  // A `key` muda quando a atividade fica indisponível, para ela voltar desmarcada.
                  <label
                    key={`${atividade.id}-${bloqueada}`}
                    className={bloqueada ? "opcao esgotada" : "opcao"}
                  >
                    <input
                      type="checkbox"
                      name="atividades"
                      value={atividade.id}
                      disabled={bloqueada}
                      defaultChecked={!bloqueada && marcadas.includes(atividade.id)}
                      onChange={(evento) => {
                        const { checked } = evento.target;
                        setMarcadas((atuais) =>
                          checked ? [...atuais, atividade.id] : atuais.filter((id) => id !== atividade.id),
                        );
                      }}
                    />
                    <span>
                      <strong>{atividade.titulo}</strong>
                      <small>
                        {atividade.quando}
                        {atividade.detalhe && ` · ${atividade.detalhe}`}
                      </small>
                      {atividade.id === "concurso-redacao" && categoria && (
                        <small className="categoria">Categoria: {categoria}</small>
                      )}
                      {restricoesPorAno[atividade.id] && (
                        <small className={foraDoAno ? "aviso-ano bloqueio" : "aviso-ano"}>
                          {restricoesPorAno[atividade.id].aviso}
                        </small>
                      )}
                      {soMunicipio && <small className="aviso-ano bloqueio">{AVISO_MUNICIPIO}</small>}
                      {soAtipicos && (
                        <small className="aviso-ano bloqueio">
                          Exclusiva para crianças atípicas: marque a opção “criança atípica”, na
                          pergunta sobre deficiência.
                        </small>
                      )}
                      {mesmoHorario.length > 0 && (
                        <small className="aviso-ano bloqueio">
                          No mesmo horário de: {mesmoHorario.map(tituloAtividade).join("; ")}. Para
                          escolher esta, desmarque a outra.
                        </small>
                      )}
                      {esgotada ? (
                        <span className="selo-vagas selo-esgotado">Vagas esgotadas</span>
                      ) : (
                        typeof restantes === "number" && (
                          <span className="selo-vagas">
                            {restantes} {restantes === 1 ? "vaga restante" : "vagas restantes"}
                          </span>
                        )
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
        <MensagemErro campo="atividades" erros={erros} />
      </fieldset>

      {menorDeIdade && (
        <fieldset className="form-grupo">
          <legend>Responsável legal</legend>
          <p className="dica">
            O participante tem menos de 18 anos: o termo abaixo deve ser aceito pelo pai, mãe ou
            responsável legal.
          </p>
          <div className="campos">
            <div className="campo campo-largo">
              <label htmlFor="responsavelNome">Nome completo do responsável legal</label>
              <input
                id="responsavelNome"
                name="responsavelNome"
                type="text"
                autoComplete="off"
                required
                minLength={3}
                maxLength={120}
                defaultValue={valores?.responsavelNome}
                aria-invalid={Boolean(erros.responsavelNome)}
                aria-describedby={descricao("responsavelNome")}
              />
              <MensagemErro campo="responsavelNome" erros={erros} />
            </div>
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
                aria-describedby={descricao("responsavelCpf")}
              />
              <MensagemErro campo="responsavelCpf" erros={erros} />
            </div>
            <div className="campo">
              <label htmlFor="responsavelContato">Telefone ou e-mail do responsável</label>
              <input
                id="responsavelContato"
                name="responsavelContato"
                type="text"
                autoComplete="off"
                required
                maxLength={120}
                defaultValue={valores?.responsavelContato}
                aria-invalid={Boolean(erros.responsavelContato)}
                aria-describedby={descricao("responsavelContato")}
              />
              <MensagemErro campo="responsavelContato" erros={erros} />
            </div>
          </div>
        </fieldset>
      )}

      <div className="form-grupo">
        <h3 id="titulo-termo" className="termo-titulo">
          {termo.titulo}
        </h3>
        {/* Caixa com rolagem; focável para quem usa teclado conseguir rolar o texto. */}
        <div className="termo" role="region" aria-labelledby="titulo-termo" tabIndex={0}>
          <p>{termo.abertura}</p>
          {termo.secoes.map((secao) => (
            <section key={secao.titulo}>
              <h4>{secao.titulo}</h4>
              {secao.paragrafos.map((paragrafo) => (
                <p key={paragrafo}>{paragrafo}</p>
              ))}
            </section>
          ))}
        </div>
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
          <span>{termo.declaracao}</span>
        </label>
        <MensagemErro campo="consentimento" erros={erros} />
        <p className="termo-registro">{termo.registro}</p>
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

function MensagemErro({ campo, erros }: { campo: Campo; erros: Erros }) {
  if (!erros[campo]) return null;
  return (
    <p id={`erro-${campo}`} className="erro-campo">
      {erros[campo]}
    </p>
  );
}
