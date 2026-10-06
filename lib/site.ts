import type { Metadata } from "next";

/*
 * Endereço público do site, usado em metadados, sitemap e dados estruturados.
 * Na Vercel vem do domínio de produção (inclusive um domínio próprio, se configurado);
 * no computador, do servidor local.
 */
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const nomeSite = "FLIM · Festival Literário de Martins";
const textoImagem =
  "Festival Literário de Martins (FLIM), de 11 a 13 de dezembro em Martins, Rio Grande do Norte. Inscrições abertas.";

// Metadados de uma página, com o endereço canônico e o compartilhamento em redes sociais.
export function metadadosPagina({
  titulo,
  descricao,
  caminho,
}: {
  titulo?: string;
  descricao: string;
  caminho: string;
}): Metadata {
  return {
    ...(titulo && { title: titulo }),
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: nomeSite,
      url: caminho,
      title: titulo ? `${titulo} · FLIM` : nomeSite,
      description: descricao,
      // Imagem de app/opengraph-image.png; repetida aqui porque o openGraph de cada página
      // substitui o padrão inteiro, imagem inclusive.
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: textoImagem }],
    },
    twitter: { card: "summary_large_image" },
  };
}
