"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { assinarEscolha, carregarPixel, gravarEscolha, lerEscolha, registrarVisita } from "@/lib/pixel";

/*
 * Aviso de cookies e pixel da Meta. O pixel só carrega depois de "Aceitar"; com "Recusar", nada é
 * carregado. Fica fora da portaria, que é de uso da comissão.
 */
export default function PixelMeta() {
  const caminho = usePathname();
  // No servidor ainda não se sabe a escolha: "servidor" faz o aviso só aparecer no navegador.
  const escolha = useSyncExternalStore(assinarEscolha, lerEscolha, () => "servidor" as const);
  const portaria = caminho.startsWith("/portaria");
  const ultimaPagina = useRef<string | null>(null);

  useEffect(() => {
    if (escolha !== "aceito" || portaria) return;
    if (ultimaPagina.current === null) {
      carregarPixel();
    } else if (ultimaPagina.current !== caminho) {
      // Troca de página sem recarregar o site: registra a nova visita.
      registrarVisita();
    }
    ultimaPagina.current = caminho;
  }, [escolha, caminho, portaria]);

  if (escolha !== null || portaria) return null;

  return (
    <div className="aviso-cookies" role="region" aria-label="Aviso de cookies">
      <p>
        Usamos cookies da Meta (Facebook e Instagram) para medir a divulgação do FLIM. Nenhum dado das
        inscrições é enviado.
      </p>
      <div className="aviso-cookies-acoes">
        <button type="button" className="btn btn-outline btn-small" onClick={() => gravarEscolha("recusado")}>
          Recusar
        </button>
        <button type="button" className="btn btn-primary btn-small" onClick={() => gravarEscolha("aceito")}>
          Aceitar
        </button>
      </div>
    </div>
  );
}

// Botão do rodapé que reabre o aviso, para a pessoa mudar a escolha.
export function BotaoCookies() {
  return (
    <button type="button" className="link-cookies" onClick={() => gravarEscolha(null)}>
      Cookies
    </button>
  );
}
