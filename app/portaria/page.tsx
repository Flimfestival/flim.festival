import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import LoginPortaria from "@/components/LoginPortaria";
import PainelPortaria from "@/components/PainelPortaria";
import { portariaConfigurada, sessaoValida } from "@/lib/portaria";
import { atividadesInscricao } from "@/lib/programacao";
import { carregarAtividade, sair } from "./actions";

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
      <header className="portaria-topo">
        <Image src="/assets/logo-marca.svg" alt="FLIM" width={420} height={277} />
        <span>Portaria</span>
        {logado && (
          <form action={sair}>
            <button type="submit" className="btn btn-outline btn-small">
              Sair
            </button>
          </form>
        )}
      </header>
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
