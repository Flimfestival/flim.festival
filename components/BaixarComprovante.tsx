"use client";

import { useEffect, useState } from "react";
import { dadosDoComprovante, gerarComprovante, nomeDoArquivo } from "@/lib/comprovante-imagem";
import type { Valores } from "@/lib/inscricao";

type Arquivo = { url: string; nome: string; imagem: File };

// iPhone e iPad (o iPad se apresenta como Mac, mas tem tela de toque).
function ehAparelhoApple() {
  const agente = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(agente) || (/Macintosh/.test(agente) && navigator.maxTouchPoints > 1);
}

/*
 * Botão "Baixar comprovante": a imagem é preparada assim que o comprovante aparece, para o toque
 * baixar na hora. No iPhone, abre o menu de compartilhar, que tem "Salvar imagem" (vai para as Fotos).
 * Se a imagem não puder ser gerada, o botão vira "Imprimir comprovante".
 */
export default function BaixarComprovante({ inscricao }: { inscricao: Valores }) {
  const [arquivo, setArquivo] = useState<Arquivo | null>(null);
  const [falhou, setFalhou] = useState(false);
  // Plano B do iPhone, se o menu de compartilhar falhar: a imagem aparece na tela para salvar.
  const [mostrarImagem, setMostrarImagem] = useState(false);

  useEffect(() => {
    let cancelado = false;
    let url: string | undefined;
    gerarComprovante(dadosDoComprovante(inscricao))
      .then((blob) => {
        if (cancelado) return;
        const nome = nomeDoArquivo(inscricao.nome);
        url = URL.createObjectURL(blob);
        setArquivo({ url, nome, imagem: new File([blob], nome, { type: "image/png" }) });
      })
      .catch((erro) => {
        console.error("Falha ao gerar o comprovante em imagem:", erro);
        if (!cancelado) setFalhou(true);
      });
    return () => {
      cancelado = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [inscricao]);

  if (falhou) {
    return (
      <button type="button" className="btn btn-primary" onClick={() => window.print()}>
        Imprimir comprovante
      </button>
    );
  }
  if (!arquivo) {
    return (
      <button type="button" className="btn btn-primary" disabled>
        Preparando o comprovante…
      </button>
    );
  }

  return (
    <>
      <a
        className="btn btn-primary"
        href={arquivo.url}
        download={arquivo.nome}
        onClick={(evento) => {
          const compartilhar = { files: [arquivo.imagem] };
          if (ehAparelhoApple() && navigator.canShare?.(compartilhar)) {
            evento.preventDefault();
            navigator.share(compartilhar).catch((erro: Error) => {
              // Fechar o menu sem escolher nada não é erro.
              if (erro.name !== "AbortError") setMostrarImagem(true);
            });
          }
        }}
      >
        Baixar comprovante
      </a>
      {mostrarImagem && (
        <figure className="comprovante-imagem">
          {/* Imagem gerada no próprio navegador (endereço blob:), por isso não usa next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={arquivo.url} alt="Comprovante de inscrição em imagem" />
          <figcaption>Toque e segure na imagem e escolha “Salvar na Fotos” ou “Salvar imagem”.</figcaption>
        </figure>
      )}
    </>
  );
}
