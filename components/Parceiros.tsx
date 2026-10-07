import Image from "next/image";
import camaraCascudo from "@/public/parceiros/camara-cascudo-secult.png";
import f7 from "@/public/parceiros/f7-producoes.png";
import faculdadeEvolucao from "@/public/parceiros/faculdade-evolucao.png";

/*
 * Faixa de logos acima do rodapé, em todas as páginas. As logos da F7 e da Câmara Cascudo vieram
 * brancas (para fundo escuro): as versões em public/parceiros/ foram escurecidas para o fundo claro.
 * `altura` é a altura exibida no computador, em pixels.
 */
const grupos = [
  {
    titulo: "Patrocínio",
    logos: [{ imagem: faculdadeEvolucao, nome: "Faculdade Evolução", altura: 72 }],
  },
  {
    titulo: "Incentivo",
    logos: [
      {
        imagem: camaraCascudo,
        nome: "Programa Cultural Câmara Cascudo e Secretaria de Estado da Cultura do Rio Grande do Norte",
        altura: 44,
      },
    ],
  },
  {
    titulo: "Realização",
    logos: [{ imagem: f7, nome: "F7 Produções", altura: 64 }],
  },
];

export default function Parceiros() {
  return (
    <section className="parceiros" aria-label="Patrocínio, incentivo e realização">
      <div className="container parceiros-inner">
        {grupos.map((grupo) => (
          <div key={grupo.titulo} className="parceiros-grupo">
            <p>{grupo.titulo}</p>
            <div className="parceiros-logos">
              {grupo.logos.map((logo) => {
                // Largura proporcional à altura; no celular, a logo larga encolhe para caber na tela.
                const largura = Math.round((logo.altura * logo.imagem.width) / logo.imagem.height);
                return (
                  <Image
                    key={logo.nome}
                    src={logo.imagem}
                    alt={logo.nome}
                    style={{ width: largura, height: "auto" }}
                    sizes={`${largura}px`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
