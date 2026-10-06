import type { Metadata } from "next";
import ChamadaFinal from "@/components/ChamadaFinal";
import Pagina from "@/components/Pagina";
import Programacao from "@/components/Programacao";
import { metadadosPagina } from "@/lib/site";

export const metadata: Metadata = metadadosPagina({
  titulo: "Programação",
  descricao:
    "Cronograma do Festival Literário de Martins (RN), de 11 a 13 de dezembro: abertura com Bráulio Bessa, painéis culturais, sarau, oficinas e concursos de redação e desenho.",
  caminho: "/programacao",
});

export default function PaginaProgramacao() {
  return (
    <Pagina>
      <div className="tiles tiles-thin" aria-hidden="true"></div>
      <Programacao />
      <ChamadaFinal />
    </Pagina>
  );
}
