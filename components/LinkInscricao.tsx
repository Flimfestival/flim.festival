import Link from "next/link";
import { evento } from "@/lib/evento";

// Botão que leva ao formulário de inscrição. Um formulário externo (https://...) abre em nova aba.
export default function LinkInscricao({
  className,
  children,
  onClick,
}: {
  className: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  if (evento.linkFormulario.startsWith("http")) {
    return (
      <a
        href={evento.linkFormulario}
        className={className}
        target="_blank"
        rel="noopener"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={evento.linkFormulario} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
