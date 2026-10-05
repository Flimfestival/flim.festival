import LinkInscricao from "./LinkInscricao";

export default function ChamadaFinal() {
  return (
    <>
      <div className="tiles tiles-thin" aria-hidden="true"></div>
      <section className="cta">
        <div className="container cta-inner">
          <h2>Garanta sua vaga no FLIM</h2>
          <p>Nos vemos na Serra de Martins.</p>
          <LinkInscricao className="btn btn-light">Inscreva-se agora</LinkInscricao>
        </div>
      </section>
    </>
  );
}
