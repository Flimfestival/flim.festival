import { creditos } from "@/lib/fotos";

export default function Rodape() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          <strong>FLIM</strong> · Festival Literário de Martins · Martins/RN
        </p>
        <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
        <p className="creditos">
          Fotos:{" "}
          {creditos.map((credito, i) => (
            <span key={credito.link}>
              {i > 0 && "; "}
              <a href={credito.link} target="_blank" rel="noopener">
                {credito.autor}
              </a>{" "}
              ({credito.descricao}, {credito.fonte})
            </span>
          ))}
          .
        </p>
      </div>
    </footer>
  );
}
