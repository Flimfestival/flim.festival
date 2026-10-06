/*
 * Fotos do site e seus créditos.
 * Para trocar uma foto, substitua o arquivo em `public/fotos/` (mantendo o nome)
 * ou importe outro arquivo aqui e atualize o crédito correspondente.
 */
import type { StaticImageData } from "next/image";
import antonioFrancisco from "@/public/fotos/convidados/antonio-francisco.jpg";
import braulioBessa from "@/public/fotos/convidados/braulio-bessa.jpg";
import socorroAcioli from "@/public/fotos/convidados/socorro-acioli.jpg";
import criancasLendo from "@/public/fotos/criancas-lendo.jpg";

export const fotos = { criancasLendo };

// Fotos dos convidados em destaque, pelo nome usado em `destaques` (lib/programacao.ts).
// `posicao` mantém o rosto à vista quando a foto é recortada para caber no cartão.
export const fotosConvidados: Record<string, { foto: StaticImageData; posicao: string }> = {
  "Bráulio Bessa": { foto: braulioBessa, posicao: "center 20%" },
  "Socorro Acioli": { foto: socorroAcioli, posicao: "42% 30%" },
  "Antônio Francisco": { foto: antonioFrancisco, posicao: "60% 15%" },
};

export const creditos: { autor: string; descricao: string; fonte: string; link?: string }[] = [
  {
    autor: "Igor de Melo",
    fonte: "divulgação",
    descricao: "Bráulio Bessa e Socorro Acioli",
  },
  {
    autor: "Ismail Salad Osman Hajji dirir",
    link: "https://unsplash.com/photos/v7FT5ngIEfA",
    fonte: "Unsplash",
    descricao: "crianças lendo",
  },
];
