import type { Metadata } from "next";
import Abertura from "@/components/Abertura";
import ChamadaFinal from "@/components/ChamadaFinal";
import ComoParticipar from "@/components/ComoParticipar";
import DadosEstruturados from "@/components/DadosEstruturados";
import Destaques from "@/components/Destaques";
import Duvidas from "@/components/Duvidas";
import Pagina from "@/components/Pagina";
import Sobre from "@/components/Sobre";
import { metadadosPagina } from "@/lib/site";

export const metadata: Metadata = metadadosPagina({
  descricao:
    "Festival Literário de Martins (RN), de 11 a 13 de dezembro: palestras com Bráulio Bessa e Socorro Acioli, painéis, sarau, oficinas e concursos. Inscrição gratuita para estudantes e visitantes.",
  caminho: "/",
});

export default function Home() {
  return (
    <Pagina>
      <DadosEstruturados />
      <Abertura />
      <Destaques />
      <Sobre />
      <ComoParticipar />
      <Duvidas />
      <ChamadaFinal />
    </Pagina>
  );
}
