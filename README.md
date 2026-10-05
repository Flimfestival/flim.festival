# FLIM — Festival Literário de Martins

Landing page do Festival Literário de Martins (RN), feita em [Next.js](https://nextjs.org) com TypeScript.

## Rodar no computador

Requer Node.js 20 ou mais recente. Dentro desta pasta:

```bash
npm install      # instala as dependências (só na primeira vez)
npm run dev      # abre o site em http://localhost:3000
```

O site atualiza sozinho enquanto você edita os arquivos.

Outros comandos:

| Comando         | O que faz                                    |
| --------------- | -------------------------------------------- |
| `npm run build` | Gera a versão final para publicação          |
| `npm start`     | Roda a versão gerada pelo `build`            |
| `npm run lint`  | Verifica o código em busca de erros comuns   |

## Como configurar

Edite `lib/evento.ts`:

| Campo            | O que é                                              |
| ---------------- | ---------------------------------------------------- |
| `linkFormulario` | Para onde vão os botões de inscrição. Padrão: `/inscricao`, a página do próprio site |
| `data`           | Data do evento exibida no topo                      |
| `local`          | Local do evento                                     |
| `emailContato`   | E-mail de contato da seção de dúvidas               |

Todos os botões de inscrição usam `linkFormulario` automaticamente. O cronograma completo e as
atividades que aparecem no formulário de inscrição ficam em `lib/programacao.ts`.

## Inscrições

A página `/inscricao` é o formulário de inscrição de estudantes. Cada inscrição é gravada em um
banco de dados no [Supabase](https://supabase.com), que também controla as vagas de cada atividade.

O formulário pede: nome completo, data de nascimento, e-mail (opcional), escola, ano escolar, se o
estudante possui alguma deficiência (com um campo opcional para detalhar o apoio necessário), as
atividades escolhidas e a autorização de uso dos dados (LGPD), dada pelo próprio estudante maior de
18 anos ou pelo responsável legal.

### Vagas

| Atividade                         | Vagas      |
| --------------------------------- | ---------- |
| Abertura (11/12, Mirante do Canto) | 600       |
| Cada um dos 4 painéis (12/12)     | 110        |
| Demais atividades                 | Sem limite |

Os números seguem o cronograma da organização; as atividades sem número no cronograma ficam sem
limite. O formulário mostra quantas vagas restam e desativa as esgotadas. A contagem é feita dentro
do banco, uma inscrição de cada vez por atividade, então nem envios simultâneos passam do limite.

**Para mudar um limite:** no Supabase, abra **Table Editor > atividades** e edite a coluna `vagas`
da atividade (deixe vazio para não ter limite). Vale na hora, sem publicar o site de novo.

**Para acompanhar:** **Table Editor > vagas_atividades** mostra vagas e inscritos de cada atividade.

### Regras por ano escolar

- Concurso de redação: do 4º ano do Ensino Fundamental ao 3º ano do Ensino Médio. A categoria
  (conto, crônica ou dissertação) aparece no formulário conforme o ano escolhido.
- Concurso de desenho: do 1º ao 3º ano do Ensino Fundamental.

O formulário desativa o concurso que o ano escolhido não pode fazer, e o servidor confere de novo
ao gravar. As regras ficam em `lib/inscricao.ts` (`restricoesPorAno`).

### Ligar o formulário ao Supabase (uma vez só)

1. Crie um projeto no Supabase.
2. No painel do projeto, abra o **SQL Editor** e rode, nesta ordem, cada arquivo de
   `supabase/migrations/` (cole o conteúdo e clique em **Run**):
   1. `20261005120000_criar_inscricoes.sql`: tabelas, vagas e função de inscrição.
   2. `20261005130000_permissoes_servidor.sql`: libera para a chave secreta só o que o site usa.
      Projetos novos do Supabase não liberam tabelas automaticamente; sem este passo, o site não lê
      as vagas nem grava inscrições.

   Se usar a CLI do Supabase, `supabase db push` faz os dois.
   Se você já tinha rodado uma versão anterior deste arquivo, rode antes
   `drop table if exists public.inscricoes;` (isso apaga as inscrições de teste que existirem).
3. Em **Project Settings > API Keys**, copie a **URL do projeto** e uma **Secret key**
   (começa com `sb_secret_`). Em projetos antigos, a chave equivalente se chama `service_role`.
4. Na pasta do projeto, crie um arquivo `.env.local` com:

   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_...
   ```

5. Reinicie o `npm run dev`. Na Vercel, cadastre as mesmas duas variáveis em
   **Settings > Environment Variables**.

### Segurança

- A chave secreta dá acesso total ao banco. Ela fica só no servidor do site: nunca use o prefixo
  `NEXT_PUBLIC_` nela e nunca a coloque no código.
- As tabelas têm o RLS ativado e nenhuma permissão pública. Mesmo com a chave pública do projeto,
  ninguém consegue ler ou gravar inscrições nem consultar as vagas; só o servidor do site acessa.
- A informação sobre deficiência é um dado sensível pela LGPD: use-a só para a acessibilidade e a
  organização das atividades, como diz a autorização do formulário.

### Ver as inscrições

No painel do Supabase, abra **Table Editor > inscricoes**. Dá para filtrar, ordenar pela data
(`criado_em`) e exportar para CSV, que abre no Excel ou no Google Planilhas. A coluna `atividades`
guarda os códigos das atividades (por exemplo `painel-1`); os nomes ficam na tabela `atividades`.

### Sem o Supabase configurado

- No seu computador (`npm run dev`), o formulário funciona, cada inscrição aparece no terminal e
  as vagas não são controladas.
- No site publicado, o formulário mostra uma mensagem de erro com o e-mail de contato, para que
  nenhuma inscrição se perca sem aviso.

### Alterar as atividades ou os campos

- As atividades do formulário ficam em `lib/programacao.ts` (`atividadesInscricao`). O `id` de cada
  uma precisa existir também na tabela `atividades` do Supabase. Para incluir uma atividade nova,
  acrescente nos dois lugares; não mude o `id` de uma atividade que já recebeu inscrições.
- A lista de escolas do formulário fica em `lib/inscricao.ts` (`escolas`). Quem estuda em outra
  escola escolhe "Outra escola" e digita o nome. Para incluir uma escola, acrescente o nome na lista.
- Os anos escolares e as regras de validação ficam em `lib/inscricao.ts`, o formulário em
  `components/FormularioInscricao.tsx` e a gravação em `app/inscricao/actions.ts`.
- Um campo novo também precisa de uma coluna nova na tabela e de um parâmetro novo na função
  `registrar_inscricao`: crie outro arquivo em `supabase/migrations/` e rode no SQL Editor.

## Onde fica cada parte

| Arquivo                          | Conteúdo                                      |
| -------------------------------- | --------------------------------------------- |
| `app/layout.tsx`                 | Título da página, descrição e fonte (Manrope) |
| `app/page.tsx`                   | Ordem das seções da página inicial            |
| `components/Pagina.tsx`          | Cabeçalho e rodapé comuns a todas as páginas  |
| `app/globals.css`                | Visual do site; as cores ficam no início      |
| `components/Cabecalho.tsx`       | Menu do topo                                  |
| `components/Abertura.tsx`        | Seção 1: logo, data, local e inscrição        |
| `components/Sobre.tsx`           | O festival e seus eixos                       |
| `app/programacao/page.tsx`       | Página de programação                         |
| `components/Programacao.tsx`     | Cronograma (conteúdo da página de programação) |
| `lib/programacao.ts`             | Dados do cronograma e atividades com inscrição |
| `components/ComoParticipar.tsx`  | Passos da inscrição                           |
| `components/Duvidas.tsx`         | Perguntas frequentes                          |
| `components/ChamadaFinal.tsx`    | Chamada final para inscrição                  |
| `components/Rodape.tsx`          | Rodapé                                        |
| `app/inscricao/page.tsx`         | Página de inscrição                           |
| `components/FormularioInscricao.tsx` | Formulário de inscrição                   |
| `lib/inscricao.ts`               | Anos escolares e regras do formulário         |
| `lib/vagas.ts`                   | Leitura das vagas restantes no Supabase       |
| `supabase/migrations/`           | Tabelas, vagas e função de inscrição do banco |

## Imagens

A identidade visual (logo, marca e faixa de azulejos) foi extraída do arquivo oficial do logo e está em
`public/assets/` (`logo.svg`, `logo-marca.svg`, `azulejos.svg`). O ícone da aba do navegador é `app/icon.svg`.

As fotos ficam em `public/fotos/` e são cadastradas em `lib/fotos.ts`, junto com os créditos exibidos no rodapé:

| Foto                  | Onde aparece | Origem   |
| --------------------- | ------------ | -------- |
| `criancas-lendo.jpg`  | O festival   | Unsplash |
| `roda-de-leitura.jpg` | Programação  | Unsplash |

Para trocar uma foto, substitua o arquivo mantendo o mesmo nome e atualize o crédito em `lib/fotos.ts`.
As fotos são recortadas e otimizadas automaticamente pelo Next.js.

## Publicação

O jeito mais simples é a [Vercel](https://vercel.com): importe o repositório e ela detecta o Next.js sozinha.
