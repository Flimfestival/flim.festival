import Image from "next/image";
import Link from "next/link";
import { sair } from "@/app/portaria/actions";

const abas = [
  { pagina: "entradas", href: "/portaria", rotulo: "Entradas" },
  { pagina: "lancamentos", href: "/portaria/lancamentos", rotulo: "Lançamento de livros" },
] as const;

// Cabeçalho do painel da comissão, com as abas e o botão de sair quando há sessão aberta.
export default function TopoPortaria({
  logado,
  atual,
}: {
  logado: boolean;
  atual: (typeof abas)[number]["pagina"];
}) {
  return (
    <>
      <header className="portaria-topo">
        <Image src="/assets/logo-marca.svg" alt="FLIM" width={420} height={277} />
        <span>Portaria</span>
        {logado && (
          <form action={sair}>
            <button type="submit" className="btn btn-outline btn-small">
              Sair
            </button>
          </form>
        )}
      </header>
      {logado && (
        <nav className="portaria-abas" aria-label="Seções do painel">
          {abas.map((aba) => (
            <Link key={aba.pagina} href={aba.href} aria-current={aba.pagina === atual ? "page" : undefined}>
              {aba.rotulo}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
