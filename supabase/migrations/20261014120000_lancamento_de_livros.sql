-- Inscrições para o lançamento de livros do FLIM (12/12/2026, Casa de Cultura de Martins).
-- Autores enviam pela página /lancamento-de-livros do site; a organização entra em contato depois para
-- confirmar a participação e alinhar horário e formato. Só o servidor do site grava (chave secreta);
-- a comissão consulta pela visão painel_lancamentos no Table Editor.
-- Não mexe nas inscrições das atividades. Pode ser rodado mais de uma vez.
-- Rode depois de 20261007140000_oficinas_abertas.sql.

create table if not exists public.lancamentos_livros (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  autor text not null check (char_length(autor) between 3 and 120),
  cidade text not null check (char_length(cidade) between 2 and 80),
  uf text not null check (uf ~ '^[A-Z]{2}$'),
  email text not null check (char_length(email) between 5 and 254),
  whatsapp text not null check (char_length(whatsapp) between 10 and 20),
  titulo text not null check (char_length(titulo) between 1 and 200),
  apresentacao text not null check (char_length(apresentacao) between 20 and 1000),
  minibiografia text not null check (char_length(minibiografia) between 20 and 600),
  consentimento boolean not null check (consentimento)
);

comment on table public.lancamentos_livros is
  'Livros inscritos para o lançamento no FLIM, enviados pelo site. Veja a visão painel_lancamentos.';

-- O mesmo e-mail com o mesmo título é o mesmo envio repetido: não grava duas vezes.
create unique index if not exists lancamentos_livros_envio_unico
  on public.lancamentos_livros (lower(email), public.normalizar_nome(titulo));

alter table public.lancamentos_livros enable row level security;
revoke all on table public.lancamentos_livros from anon, authenticated;
grant select, insert on table public.lancamentos_livros to service_role;

-- Uma linha por livro, com colunas em português e horário de Brasília.
create or replace view public.painel_lancamentos with (security_invoker = true) as
select
  row_number() over (order by l.criado_em) as "Nº",
  to_char(l.criado_em at time zone 'America/Fortaleza', 'DD/MM/YYYY HH24:MI') as "Enviado em",
  l.autor as "Autor",
  l.cidade || '/' || l.uf as "Cidade/UF",
  l.email as "E-mail",
  l.whatsapp as "WhatsApp",
  l.titulo as "Título",
  l.apresentacao as "Apresentação do livro",
  l.minibiografia as "Minibiografia",
  l.id as "Código"
from public.lancamentos_livros l
order by l.criado_em;

comment on view public.painel_lancamentos is 'Livros inscritos para o lançamento, na ordem de envio.';
revoke all on table public.painel_lancamentos from anon, authenticated;
