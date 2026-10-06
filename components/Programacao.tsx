import { categoriasRedacao, concursoDesenho, dias, oficinas } from "@/lib/programacao";

export default function Programacao() {
  return (
    <section className="section section-tint">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow eyebrow-green">Programação</p>
          <h1>Três dias de literatura na Serra de Martins</h1>
          <p className="intro">
            11, 12 e 13 de dezembro. Os horários indicam o início das atividades. As marcadas com
            “Com inscrição” pedem inscrição prévia pelo formulário, e algumas têm vagas limitadas.
          </p>
        </div>

        <nav className="dias-nav" aria-label="Partes da programação">
          {dias.map((dia) => (
            <a key={dia.id} href={`#${dia.id}`}>
              {dia.data.split(", ")[1]}
            </a>
          ))}
          <a href="#oficinas">Oficinas</a>
          <a href="#concurso-desenho">Concurso de desenho</a>
        </nav>

        {dias.map((dia) => (
          <article key={dia.id} id={dia.id} className="dia">
            <header className="dia-cabecalho">
              <p className="dia-data">{dia.data}</p>
              <h2>{dia.titulo}</h2>
              <p className="dia-local">{dia.local}</p>
            </header>
            <ol className="agenda">
              {dia.itens.map((item) => (
                <li key={item.horario + item.titulo}>
                  <span className="agenda-hora">{item.horario}</span>
                  <div>
                    <h3>
                      {item.titulo}
                      {item.comInscricao && <span className="selo-inscricao">Com inscrição</span>}
                    </h3>
                    {item.detalhes?.map((detalhe) => (
                      <p key={detalhe}>{detalhe}</p>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
            {dia.notas && (
              <div className="dia-notas">
                {dia.notas.map((nota) => (
                  <p key={nota}>{nota}</p>
                ))}
              </div>
            )}
            {dia.id === "dia-13" && (
              <div className="tabela-rolagem">
                <table className="tabela">
                  <caption>Categorias do concurso de redação</caption>
                  <thead>
                    <tr>
                      <th scope="col">Participantes</th>
                      <th scope="col">Gênero textual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriasRedacao.map((categoria) => (
                      <tr key={categoria.participantes}>
                        <td>{categoria.participantes}</td>
                        <td>{categoria.genero}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        ))}

        <article id="oficinas" className="dia">
          <header className="dia-cabecalho">
            <p className="dia-data">{oficinas.data}</p>
            <h2>{oficinas.titulo}</h2>
            <p className="dia-local">{oficinas.local}</p>
          </header>
          <ol className="agenda">
            {oficinas.itens.map((oficina) => (
              <li key={oficina.titulo}>
                <span className="agenda-hora">{oficina.horario}</span>
                <div>
                  <h3>{oficina.titulo}</h3>
                  <p>Responsáveis: {oficina.responsaveis}</p>
                  <p>Público: {oficina.publico}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="dia-notas">
            <p>{oficinas.nota}</p>
          </div>
        </article>

        <article id="concurso-desenho" className="dia">
          <header className="dia-cabecalho">
            <p className="dia-data">Premiação em 12 de dezembro</p>
            <h2>Concurso de desenho</h2>
          </header>
          <dl className="ficha">
            <div>
              <dt>Público</dt>
              <dd>{concursoDesenho.publico}</dd>
            </div>
            <div>
              <dt>Premiação</dt>
              <dd>{concursoDesenho.premio}</dd>
            </div>
            <div>
              <dt>Exposição</dt>
              <dd>{concursoDesenho.exposicao}</dd>
            </div>
            <div>
              <dt>Quando</dt>
              <dd>{concursoDesenho.quando}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}
