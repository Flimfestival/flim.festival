import Link from "next/link";
import { evento } from "@/lib/evento";
import { creditos } from "@/lib/fotos";

const links = [
  { href: "/", label: "Início" },
  { href: "/programacao", label: "Programação" },
  { href: "/inscricao", label: "Inscrição" },
  { href: "/#duvidas", label: "Dúvidas" },
];

export default function Rodape() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          <strong>FLIM</strong> · Festival Literário de Martins · {evento.data} · {evento.local}
        </p>
        <nav aria-label="Rodapé" className="footer-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <a href={`mailto:${evento.emailContato}`}>{evento.emailContato}</a>
        </nav>
        <p>© {new Date().getFullYear()} Festival Literário de Martins.</p>
        <p className="creditos">
          Fotos:{" "}
          {creditos.map((credito, i) => (
            <span key={credito.autor + credito.descricao}>
              {i > 0 && "; "}
              {credito.link ? (
                <a href={credito.link} target="_blank" rel="noopener noreferrer">
                  {credito.autor}
                </a>
              ) : (
                credito.autor
              )}{" "}
              ({credito.descricao}, {credito.fonte})
            </span>
          ))}
          .
        </p>
      </div>
    </footer>
  );
}
