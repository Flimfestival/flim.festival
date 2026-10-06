import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { nomeSite, siteUrl } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Padrão de todas as páginas; cada página completa com título, descrição e endereço próprios.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: nomeSite, template: "%s · FLIM" },
  applicationName: "FLIM",
  keywords: [
    "Festival Literário de Martins",
    "FLIM",
    "Martins RN",
    "festival literário",
    "Bráulio Bessa",
    "Socorro Acioli",
    "literatura potiguar",
  ],
};

export const viewport: Viewport = {
  themeColor: "#104990",
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
