"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LinkInscricao from "./LinkInscricao";

const links = [
  { href: "/#sobre", label: "O festival" },
  { href: "/programacao", label: "Programação" },
  { href: "/edital", label: "Edital" },
  { href: "/#participar", label: "Como participar" },
  { href: "/#duvidas", label: "Dúvidas" },
];

export default function Cabecalho() {
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const fechar = () => setAberto(false);

  // Fecha o menu do celular com a tecla Esc e devolve o foco ao botão do menu.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="FLIM, Festival Literário de Martins, início">
          <Image src="/assets/logo-marca.svg" alt="" width={420} height={277} />
          <span>
            Festival Literário
            <br />
            de Martins
          </span>
        </Link>
        <div className="header-actions">
          {/* No celular, a inscrição fica sempre visível no topo, fora do menu */}
          <LinkInscricao className="btn btn-primary btn-small header-cta">Inscreva-se</LinkInscricao>
          <button
            ref={botaoMenu}
            className="nav-toggle"
            aria-expanded={aberto}
            aria-controls="menu"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto(!aberto)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <nav id="menu" className={aberto ? "nav open" : "nav"}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={fechar}
              aria-current={link.href === caminho ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <LinkInscricao className="btn btn-primary btn-small" onClick={fechar}>
            Inscreva-se
          </LinkInscricao>
        </nav>
      </div>
    </header>
  );
}
