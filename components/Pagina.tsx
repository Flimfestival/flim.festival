import Cabecalho from "./Cabecalho";
import Parceiros from "./Parceiros";
import Rodape from "./Rodape";

// Estrutura comum a todas as páginas: atalho de acessibilidade, cabeçalho, conteúdo, logos e rodapé.
export default function Pagina({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo">{children}</main>
      <Parceiros />
      <Rodape />
    </>
  );
}
