import type { Metadata } from "next";
import ChamadaFinal from "@/components/ChamadaFinal";
import Pagina from "@/components/Pagina";
import Programacao from "@/components/Programacao";

export const metadata: Metadata = {
  title: "Programação · Festival Literário de Martins",
  description:
    "Cronograma do Festival Literário de Martins (RN), de 11 a 13 de dezembro: abertura com Bráulio Bessa, painéis culturais, sarau, oficinas e concursos de redação e desenho.",
};

export default function PaginaProgramacao() {
  return (
    <Pagina>
      <div className="tiles tiles-thin" aria-hidden="true"></div>
      <Programacao />
      <ChamadaFinal />
    </Pagina>
  );
}
