import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLIM · Festival Literário de Martins",
  description:
    "Festival Literário de Martins (RN): um encontro dedicado à leitura, à escrita e à formação de leitores. Faça sua inscrição.",
  openGraph: {
    title: "FLIM · Festival Literário de Martins",
    description:
      "Um encontro dedicado à leitura, à escrita e à formação de leitores na Serra de Martins (RN).",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      {/* Extensões do navegador (ex.: ColorZilla) adicionam atributos ao <body> antes do React
          carregar; isto ignora só essas diferenças de atributo, não o conteúdo da página. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
