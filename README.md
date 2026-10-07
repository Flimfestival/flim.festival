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

A página `/inscricao` é o formulário de inscrição de estudantes e visitantes. Cada inscrição é
gravada em um banco de dados no [Supabase](https://supabase.com), que também controla as vagas de
cada atividade.

O formulário pede: se a inscrição é de estudante ou de visitante, nome completo, data de nascimento,
e-mail (opcional), escola e ano escolar (só estudantes), se o participante possui alguma deficiência
(com um campo opcional para detalhar o apoio necessário), as atividades escolhidas e o aceite do
termo de consentimento.

**Visitantes** (familiares, professores, moradores, turistas) não informam escola nem ano escolar e
podem se inscrever na abertura, nos painéis e na palestra. O concurso de redação e as oficinas são
exclusivos para estudantes: o formulário desativa essas atividades para visitantes, o servidor
confere de novo e o banco também recusa (coluna `so_estudantes` da tabela `atividades`). Visitantes
ocupam as mesmas vagas que os estudantes.

### Comprovante

Depois de enviar, a pessoa vê o comprovante na tela e o botão **Baixar comprovante**, que salva uma
imagem PNG com os dados da inscrição e as atividades (`lib/comprovante-imagem.ts`). No iPhone, o botão
abre o menu de compartilhar, que tem "Salvar imagem". O comprovante não depende da impressão, que não
funciona nos navegadores de aplicativos (Instagram, Facebook); nesses, a tela também orienta a tirar
um print.

### Edital do concurso de redação

O edital assinado fica em `public/documentos/edital-concurso-de-redacao.pdf` e abre pelo item
**Edital** do menu, pelo rodapé e pela programação. O endereço curto `/edital` leva ao mesmo arquivo.
Para publicar uma nova versão, substitua o PDF mantendo o nome. O endereço do arquivo fica em
`lib/evento.ts` (`edital`).

### Termo de consentimento

O formulário mostra o **Termo de Consentimento, Participação e Autorização de Uso de Imagem e Voz**
completo, numa caixa com rolagem, antes da caixinha de aceite. O texto fica em `lib/termo.ts`.

- Quando a data de nascimento indica **menos de 18 anos**, o formulário passa a exigir nome, CPF e
  telefone ou e-mail do **responsável legal**, que é quem aceita o termo. O CPF é conferido pelos
  dígitos verificadores.
- Cada inscrição guarda a **versão do termo** aceita e a **data e hora do aceite** (registro
  eletrônico do consentimento). A visão `painel_inscricoes` mostra esses dados e o responsável.
- **Ao mudar o texto do termo, mude também `TERMO_VERSAO`** em `lib/termo.ts`, para saber qual versão
  cada pessoa aceitou.

### Vagas

| Atividade                         | Vagas      |
| --------------------------------- | ---------- |
| Abertura (11/12, Mirante do Canto) | 600       |
| Cada um dos 4 painéis (12/12)     | 110        |
| Cada uma das 3 oficinas (12/12)   | 25         |
| Demais atividades                 | Sem limite |

Os números seguem o cronograma da organização; as atividades sem número no cronograma ficam sem
limite. O formulário mostra quantas vagas restam e desativa as esgotadas. A contagem é feita dentro
do banco, uma inscrição de cada vez por atividade, então nem envios simultâneos passam do limite.

**Para mudar um limite:** no Supabase, abra **Table Editor > atividades** e edite a coluna `vagas`
da atividade (deixe vazio para não ter limite). Vale na hora, sem publicar o site de novo.

**Para acompanhar:** **Table Editor > vagas_atividades** mostra vagas e inscritos de cada atividade.

### Regras por ano escolar

- Concurso de redação: do 4º ano do Ensino Fundamental à 3ª série do Nível Médio. A categoria
  (conto, crônica ou dissertação) aparece no formulário conforme o ano escolhido.
- Oficina de desenho criativo: exclusiva para crianças atípicas. Só fica disponível depois de marcar
  a caixa "criança atípica" no formulário.

- Concurso de redação e oficinas: só para estudantes das escolas de Martins (as da lista do
  formulário). Quem escolhe "Outra escola" e os visitantes podem se inscrever na abertura, nos
  painéis e na palestra, mas não nessas atividades (`ATIVIDADES_MUNICIPIO` em `lib/inscricao.ts`).

O concurso de desenho não aparece no formulário: as inscrições dele são feitas em papel.

O formulário desativa o concurso que o ano escolhido não pode fazer, e o servidor confere de novo
ao gravar. As regras ficam em `lib/inscricao.ts` (`restricoesPorAno`).

### Atividades no mesmo horário

No sábado, 12/12, as oficinas começam junto com os painéis: oficina de redação e painel Literatura e
identidade, oficina de poesia e painel Escreva, leia... eternize-se, oficina de desenho criativo e
painel Povo, natureza e poesia. O estudante escolhe só uma de cada par: ao marcar uma, o formulário
desativa a outra. O banco confere de novo, inclusive quando o estudante volta depois para acrescentar
uma atividade. Os pares ficam em `lib/programacao.ts`
(`horariosSimultaneos`) e na tabela `atividades_simultaneas` do Supabase; ao mudar, mude nos dois.

### Ligar o formulário ao Supabase (uma vez só)

1. Crie um projeto no Supabase.
2. No painel do projeto, abra o **SQL Editor** e rode, nesta ordem, cada arquivo de
   `supabase/migrations/` (cole o conteúdo e clique em **Run**):
   1. `20261005120000_criar_inscricoes.sql`: tabelas, vagas e função de inscrição.
   2. `20261005130000_permissoes_servidor.sql`: libera para a chave secreta só o que o site usa.
      Projetos novos do Supabase não liberam tabelas automaticamente; sem este passo, o site não lê
      as vagas nem grava inscrições.
   3. `20261005140000_visoes_para_organizacao.sql`: visões para acompanhar as inscrições (veja
      "Ver as inscrições").
   4. `20261005150000_bloquear_inscricao_repetida.sql`: recusa uma segunda inscrição do mesmo
      estudante (mesmo nome e data de nascimento).
   5. `20261006120000_presencas_portaria.sql`: presenças registradas no painel da portaria.
   6. `20261006130000_inscricao_por_atividade.sql`: repetição bloqueada por atividade (veja abaixo)
      e a visão `possiveis_repetidas`.
   7. `20261006140000_programacao_atualizada.sql`: dia, horário e local das atividades conforme a
      programação completa de 2026.
   8. `20261006150000_termo_e_horarios.sql`: dados do responsável legal, registro do aceite do
      termo de consentimento e atividades no mesmo horário.
   9. `20261006160000_limite_de_envios.sql`: limite de tentativas por conexão (veja "Segurança").
   10. `20261006170000_remover_concurso_desenho.sql`: tira o concurso de desenho da lista (inscrição em papel).
   11. `20261006180000_vagas_oficinas.sql`: 25 vagas em cada oficina.
   12. `20261007120000_visitantes.sql`: inscrição de visitantes, sem escola nem ano escolar.
   13. `20261007130000_nomes_dos_paineis.sql`: painéis chamados pelo nome, sem o número.

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

No painel do Supabase, abra o **Table Editor**. Além das tabelas, há quatro visões prontas para
consulta, com colunas em português e horário de Brasília:

| Visão                 | O que mostra                                                          |
| --------------------- | --------------------------------------------------------------------- |
| `painel_inscricoes`   | Uma linha por inscrição, com idade, escola, ano e atividades pelo nome; visitantes aparecem com "Visitante" na escola |
| `lista_por_atividade` | Uma linha por inscrito em cada atividade, com a hora da entrada; filtre a coluna "Atividade" para a lista de presença |
| `resumo_vagas`        | Vagas, inscritos, vagas restantes, ocupação e presentes de cada atividade |
| `resumo_escolas`      | Inscritos por escola; os visitantes aparecem juntos, na linha "Visitantes" |

Dá para filtrar, ordenar e exportar para CSV, que abre no Excel ou no Google Planilhas. A tabela
`inscricoes` guarda os dados originais; a coluna `atividades` tem os códigos (por exemplo `painel-1`).

Cada pessoa tem uma inscrição só. É considerado o mesmo estudante apenas quando coincidem, ao
mesmo tempo, o nome completo (ignorando só acentos, maiúsculas e pontuação), a data de nascimento e a
escola; o mesmo visitante, quando coincidem o nome completo e a data de nascimento. Nomes parecidos
nunca são juntados, e um estudante e um visitante com o mesmo nome e data são inscrições separadas.
Se a mesma pessoa se inscrever de novo:

- as atividades novas são acrescentadas à inscrição que já existe, com a conferência de vagas;
- as atividades repetidas são ignoradas, com um aviso;
- os dados da primeira inscrição (ano, e-mail) são mantidos.

A visão `possiveis_repetidas` lista pares que podem ser do mesmo estudante escrito de outro jeito
(mesma data de nascimento e mesmo primeiro nome, ou mesmo nome com data diferente). Nada é bloqueado
automaticamente, porque gêmeos aparecem ali também: a comissão revisa e, se for o caso, junta as
atividades numa linha e apaga a outra em **Table Editor > inscricoes**.

### Sem o Supabase configurado

- No seu computador (`npm run dev`), o formulário funciona, cada inscrição aparece no terminal e
  as vagas não são controladas.
- No site publicado, o formulário mostra uma mensagem de erro com o e-mail de contato, para que
  nenhuma inscrição se perca sem aviso.

### Alterar as atividades ou os campos

- As atividades do formulário ficam em `lib/programacao.ts` (`atividadesInscricao`). O `id` de cada
  uma precisa existir também na tabela `atividades` do Supabase. Para incluir uma atividade nova,
  acrescente nos dois lugares; não mude o `id` de uma atividade que já recebeu inscrições.
- A lista de escolas do formulário fica em `lib/inscricao.ts` (`escolas`), com os anos que cada uma
  oferece: ao escolher a escola, o campo de ano mostra só esses anos. Quem estuda em outra escola
  escolhe "Outra escola" e digita o nome. Para incluir uma escola, acrescente na lista.
- Os anos escolares e as regras de validação ficam em `lib/inscricao.ts`, o formulário em
  `components/FormularioInscricao.tsx` e a gravação em `app/inscricao/actions.ts`.
- Um campo novo também precisa de uma coluna nova na tabela e de um parâmetro novo na função
  `inscrever_estudante`: crie outro arquivo em `supabase/migrations/` e rode no SQL Editor.

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
| `components/Parceiros.tsx`       | Logos de patrocínio, incentivo e realização (acima do rodapé) |
| `components/Rodape.tsx`          | Rodapé                                        |
| `public/documentos/`             | Edital do concurso de redação (PDF assinado)  |
| `lib/comprovante-imagem.ts`      | Comprovante de inscrição em imagem (PNG)      |
| `app/inscricao/page.tsx`         | Página de inscrição                           |
| `components/FormularioInscricao.tsx` | Formulário de inscrição                   |
| `lib/inscricao.ts`               | Anos escolares e regras do formulário         |
| `lib/vagas.ts`                   | Leitura das vagas restantes no Supabase       |
| `supabase/migrations/`           | Tabelas, vagas e função de inscrição do banco |

## Imagens

A identidade visual (logo, marca e faixa de azulejos) foi extraída do arquivo oficial do logo e está em
`public/assets/` (`logo.svg`, `logo-marca.svg`, `azulejos.svg`). Os ícones da aba usam a marca "FLIM" (com o traço um pouco mais grosso, para ficar legível em
16 px): `app/icon.svg`, `app/favicon.ico` (navegadores antigos) e `app/apple-icon.png` (tela de
início do iPhone).

As fotos ficam em `public/fotos/` e são cadastradas em `lib/fotos.ts`, junto com os créditos exibidos no rodapé:

| Foto                  | Onde aparece | Origem   |
| --------------------- | ------------ | -------- |
| `criancas-lendo.jpg`  | O festival   | Unsplash |

Para trocar uma foto, substitua o arquivo mantendo o mesmo nome e atualize o crédito em `lib/fotos.ts`.

As logos de patrocínio (Faculdade Evolução), incentivo (Programa Cultural Câmara Cascudo e Secretaria
de Estado da Cultura do RN) e realização (F7 Produções) ficam em `public/parceiros/` e aparecem numa
faixa clara acima do rodapé, em todas as páginas (`components/Parceiros.tsx`). Os originais estão em
`public/assets/`; as logos da F7 e da Câmara Cascudo vieram brancas e foram escurecidas para o fundo
claro.
As fotos são recortadas e otimizadas automaticamente pelo Next.js.

## Portaria

O endereço `/portaria` (`https://www.festivalflim.com.br/portaria`) é o painel da
comissão para a entrada das atividades. Não aparece no menu nem nos buscadores.

1. Entre com a senha da comissão. A sessão vale por 12 horas naquele aparelho.
2. Escolha a atividade e digite parte do nome do participante (acentos e maiúsculas não importam).
3. Cada resultado mostra escola, ano escolar (ou "Visitante") e data de nascimento, para diferenciar
   nomes iguais:
   - **verde**: inscrição nesta atividade, com o botão **Registrar entrada**;
   - **azul**: entrada já registrada, com a hora e a opção **Desfazer**;
   - **amarelo**: inscrição em outra atividade;
   - **vermelho**: nenhum inscrito com esse nome. O painel informa se ainda há vagas, para o estudante
     se inscrever pelo site.
4. Os contadores mostram inscritos, presentes e vagas restantes, e se atualizam a cada minuto.

Uma mesma entrada nunca é registrada duas vezes, nem com dois celulares ao mesmo tempo.
Sem internet no local, use a visão `lista_por_atividade` impressa como reserva.

**Senha:** fica na variável `SENHA_PORTARIA` (no `.env.local` e na Vercel, em **Settings >
Environment Variables**), com pelo menos 12 caracteres; sem ela o painel fica desativado. Trocar a
senha encerra todas as sessões abertas. Troque depois do festival.

## SEO e compartilhamento

- Cada página tem título, descrição e endereço canônico próprios (`lib/site.ts`).
- `app/sitemap.ts` e `app/robots.ts` geram o `sitemap.xml` e o `robots.txt` para os buscadores.
- A página inicial tem os dados do evento no formato do Google (`components/DadosEstruturados.tsx`):
  datas, local e convidados. As datas ficam em `lib/evento.ts` (`inicio` e `fim`).
- `app/opengraph-image.png` é a imagem que aparece ao compartilhar o link (WhatsApp, redes sociais).
  Se a data ou o texto mudarem, ela precisa ser refeita.
- O endereço do site vem da Vercel automaticamente; com um domínio próprio, nada precisa mudar.

## Segurança

- `next.config.ts` envia cabeçalhos de segurança: política de conteúdo (o site só carrega arquivos
  de si mesmo), bloqueio de exibição dentro de outros sites e restrições de câmera, microfone e
  localização.
- O formulário valida tudo no servidor, tem um campo invisível contra robôs, e o banco confere
  vagas, inscrições repetidas, horários simultâneos e permissões.
- Limite de tentativas por conexão (`lib/limite.ts` e tabela `limites_envio`): 45 inscrições a cada
  10 minutos, folgado para uma escola inscrever uma turma, e 10 tentativas de senha a cada
  15 minutos na portaria. A conexão é guardada só como código embaralhado, apagado depois de 1 dia.
- Textos livres (nomes, escola, descrição de deficiência) não podem começar com `=`, `+`, `-` ou `@`,
  para não virarem fórmulas na planilha exportada do Supabase. O telefone aceita só números e
  pontuação.
- O CPF do responsável fica guardado no Supabase, acessível só pelo painel do projeto e pelo
  servidor do site. Limite o acesso ao painel do Supabase às pessoas da comissão.

## Publicação

O jeito mais simples é a [Vercel](https://vercel.com): importe o repositório e ela detecta o Next.js sozinha.
