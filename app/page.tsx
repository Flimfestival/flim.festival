import Abertura from "@/components/Abertura";
import ChamadaFinal from "@/components/ChamadaFinal";
import ComoParticipar from "@/components/ComoParticipar";
import Duvidas from "@/components/Duvidas";
import Pagina from "@/components/Pagina";
import Sobre from "@/components/Sobre";

export default function Home() {
  return (
    <Pagina>
      <Abertura />
      <Sobre />
      <ComoParticipar />
      <Duvidas />
      <ChamadaFinal />
    </Pagina>
  );
}
