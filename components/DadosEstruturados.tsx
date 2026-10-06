import { evento } from "@/lib/evento";
import { fotosConvidados } from "@/lib/fotos";
import { destaques } from "@/lib/programacao";
import { siteUrl } from "@/lib/site";

// Dados do evento no formato schema.org, para o Google mostrar data, local e convidados nas buscas.
export default function DadosEstruturados() {
  const dados = {
    "@context": "https://schema.org",
    "@type": "Festival",
    name: "Festival Literário de Martins (FLIM)",
    description:
      "Encontro dedicado à leitura, à escrita e à formação de leitores na Serra de Martins (RN), com palestras, painéis, sarau, oficinas e concursos.",
    startDate: evento.inicio,
    endDate: evento.fim,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    inLanguage: "pt-BR",
    url: siteUrl,
    image: [`${siteUrl}/opengraph-image.png`],
    location: {
      "@type": "Place",
      name: "Martins",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Martins",
        addressRegion: "RN",
        addressCountry: "BR",
      },
    },
    organizer: { "@type": "Organization", name: "Festival Literário de Martins", url: siteUrl },
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/inscricao`,
    },
    performer: destaques.map((convidado) => ({
      "@type": "Person",
      name: convidado.nome,
      ...(fotosConvidados[convidado.nome] && {
        image: `${siteUrl}${fotosConvidados[convidado.nome].foto.src}`,
      }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Troca "<" pelo código unicode para nenhum texto conseguir fechar a tag <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\u003c") }}
    />
  );
}
