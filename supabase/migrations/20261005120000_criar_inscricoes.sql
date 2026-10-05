-- Inscrições do Festival Literário de Martins (FLIM), com limite de vagas por atividade.
-- Rode uma vez no SQL Editor do Supabase (ou com `supabase db push`, se usar a CLI).

-- Atividades que pedem inscrição. Para mudar o limite, edite a coluna `vagas`
-- no Table Editor; vazio (null) significa sem limite.
create table public.atividades (
  id text primary key,
  titulo text not null,
  vagas integer check (vagas >= 0),
  ordem integer not null default 0
);

insert into public.atividades (id, titulo, vagas, ordem) values
  ('abertura', 'Abertura com palestra de Bráulio Bessa', 600, 1),
  ('painel-1', '1º painel: Literatura e identidade', 110, 2),
  ('painel-2', '2º painel: Educação, oportunidade e evolução', 110, 3),
  ('painel-3', '3º painel: Escreva, leia... eternize-se', 110, 4),
  ('painel-4', '4º painel: Povo, natureza e poesia', 110, 5),
  ('palestra-socorro-acioli', 'Palestra com Socorro Acioli', null, 6),
  ('concurso-redacao', 'Concurso de redação', null, 7),
  ('oficina-redacao', 'Oficina de redação: Dissertar, da ideia ao texto', null, 8),
  ('oficina-poesia', 'Oficina de poesia', null, 9),
  ('oficina-desenho', 'Oficina de desenho criativo', null, 10),
  ('concurso-desenho', 'Concurso de desenho', null, 11);

create table public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  nome text not null check (char_length(nome) between 3 and 120),
  escola text not null check (char_length(escola) between 2 and 160),
  ano_escolar text not null check (char_length(ano_escolar) <= 60),
  data_nascimento date not null check (data_nascimento > date '1900-01-01'),
  email text check (char_length(email) between 5 and 254),
  possui_deficiencia boolean not null,
  deficiencia text check (char_length(deficiencia) <= 500),
  atividades text[] not null check (cardinality(atividades) between 1 and 20),
  consentimento boolean not null check (consentimento)
);

comment on table public.inscricoes is 'Inscrições de estudantes recebidas pelo formulário do site do FLIM.';

create index inscricoes_criado_em_idx on public.inscricoes (criado_em desc);
create index inscricoes_atividades_idx on public.inscricoes using gin (atividades);

-- Vagas e inscritos por atividade. Também serve de relatório no Table Editor.
create view public.vagas_atividades with (security_invoker = true) as
select
  a.id,
  a.titulo,
  a.vagas,
  (select count(*) from public.inscricoes i where i.atividades @> array[a.id]) as inscritos,
  a.ordem
from public.atividades a;

-- Grava uma inscrição só se houver vaga em todas as atividades escolhidas.
-- Retorna a lista de atividades esgotadas; lista vazia significa inscrição gravada.
create function public.registrar_inscricao(
  p_nome text,
  p_escola text,
  p_ano_escolar text,
  p_data_nascimento date,
  p_email text,
  p_possui_deficiencia boolean,
  p_deficiencia text,
  p_atividades text[],
  p_consentimento boolean
)
returns text[]
language plpgsql
set search_path = ''
as $$
declare
  v_esgotadas text[];
begin
  if exists (
    select 1 from unnest(p_atividades) as escolhida(id)
    where not exists (select 1 from public.atividades a where a.id = escolhida.id)
  ) then
    raise exception 'Atividade desconhecida na inscrição.';
  end if;

  -- Trava as atividades escolhidas: inscrições simultâneas nas mesmas atividades esperam a vez,
  -- então a contagem abaixo nunca deixa passar do limite.
  perform 1 from public.atividades a where a.id = any (p_atividades) order by a.id for update;

  select coalesce(array_agg(a.id order by a.ordem), '{}')
    into v_esgotadas
    from public.atividades a
   where a.id = any (p_atividades)
     and a.vagas is not null
     and (select count(*) from public.inscricoes i where i.atividades @> array[a.id]) >= a.vagas;

  if cardinality(v_esgotadas) > 0 then
    return v_esgotadas;
  end if;

  insert into public.inscricoes (
    nome, escola, ano_escolar, data_nascimento, email,
    possui_deficiencia, deficiencia, atividades, consentimento
  ) values (
    p_nome, p_escola, p_ano_escolar, p_data_nascimento, p_email,
    p_possui_deficiencia, p_deficiencia, p_atividades, p_consentimento
  );

  return '{}';
end;
$$;

-- Acesso: só o servidor do site lê e grava, usando a chave secreta (que ignora o RLS).
-- Com o RLS ativo e sem políticas, a chave pública do projeto não acessa nada disto.
alter table public.atividades enable row level security;
alter table public.inscricoes enable row level security;
revoke all on table public.atividades, public.inscricoes, public.vagas_atividades from anon, authenticated;
revoke execute on function public.registrar_inscricao(text, text, text, date, text, boolean, text, text[], boolean)
  from public, anon, authenticated;
grant execute on function public.registrar_inscricao(text, text, text, date, text, boolean, text, text[], boolean)
  to service_role;
