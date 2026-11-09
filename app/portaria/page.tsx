import type { Metadata } from "next";
import { connection } from "next/server";
import LoginPortaria from "@/components/LoginPortaria";
import PainelPortaria from "@/components/PainelPortaria";
import TopoPortaria from "@/components/TopoPortaria";
import { portariaConfigurada, sessaoValida } from "@/lib/portaria";
import { atividadesInscricao } from "@/lib/programacao";
import { carregarAtividade } from "./actions";

// Painel da comissão: fora do menu, do sitemap e dos buscadores.
export const metadata: Metadata = {
  title: "Portaria",
  robots: { index: false, follow: false },
};

const atividades = atividadesInscricao.map((atividade) => ({
  id: atividade.id,
  titulo: atividade.titulo,
  rotulo: `${atividade.titulo} (${atividade.grupo.split(" · ")[0]}, ${atividade.quando})`,
}));

export default async function PaginaPortaria() {
  await connection();
  const configurada = portariaConfigurada();
  const logado = configurada && (await sessaoValida());

  return (
    <div className="portaria">
      <TopoPortaria logado={logado} atual="entradas" />
      <main id="conteudo" className="portaria-conteudo">
        {!configurada ? (
          <p className="form-alerta">
            O painel da portaria está desativado. Configure a variável SENHA_PORTARIA (veja o README).
          </p>
        ) : logado ? (
          <PainelPortaria atividades={atividades} inicial={await carregarAtividade(atividades[0].id)} />
        ) : (
          <LoginPortaria />
        )}
      </main>
    </div>
  );
}
