-- Visões para a organização acompanhar as inscrições no Table Editor do Supabase.
-- Só leem os dados: não alteram as tabelas nem o funcionamento do site.
-- Rode depois de 20261005130000_permissoes_servidor.sql.

-- Dia, horário e local de cada atividade, para as listas por atividade.
alter table public.atividades add column if not exists quando text;
comment on column public.atividades.quando is 'Dia, horário e local, exibidos na visão lista_por_atividade.';

update public.atividades a set quando = v.quando
from (values
  ('abertura', '11/12 (sex), a partir das 16h · Mirante do Canto'),
  ('painel-1', '12/12 (sáb), 9h30 · Casa de Cultura'),
  ('painel-2', '12/12 (sáb), 11h30 · Casa de Cultura'),
  ('painel-3', '12/12 (sáb), 14h15 · Casa de Cultura'),
  ('painel-4', '12/12 (sáb), 15h45 · Casa de Cultura'),
  ('palestra-socorro-acioli', '12/12 (sáb), 17h30 · Casa de Cultura'),
  ('concurso-redacao', '13/12 (dom), 9h · Colégio Estadual Almino Afonso'),
  ('oficina-redacao', 'Data a definir, 9h · Colégio Estadual Almino Afonso'),
  ('oficina-poesia', 'Data a definir, 14h · Colégio Estadual Almino Afonso'),
  ('oficina-desenho', 'Data a definir, 15h30 · Colégio Estadual Almino Afonso'),
  ('concurso-desenho', 'Data a definir')
) as v(id, quando)
where a.id = v.id;

comment on column public.inscricoes.atividades is
  'Códigos das atividades escolhidas. Os nomes aparecem nas visões painel_inscricoes e lista_por_atividade.';

-- Uma linha por estudante, na ordem de inscrição.
create or replace view public.painel_inscricoes with (security_invoker = true) as
select
  row_number() over (order by i.criado_em) as "Nº",
  to_char(i.criado_em at time zone 'America/Fortaleza', 'DD/MM/YYYY HH24:MI') as "Inscrito em",
  i.nome as "Nome",
  extract(year from age(current_date, i.data_nascimento))::int as "Idade",
  to_char(i.data_nascimento, 'DD/MM/YYYY') as "Nascimento",
  i.escola as "Escola",
  i.ano_escolar as "Ano escolar",
  (select string_agg(a.titulo, '; ' order by a.ordem)
     from public.atividades a
    where a.id = any (i.atividades)) as "Atividades",
  case when i.possui_deficiencia then 'Sim' else 'Não' end as "Deficiência",
  i.deficiencia as "Qual / apoio necessário",
  i.email as "E-mail",
  i.id as "Código"
from public.inscricoes i
order by i.criado_em;

-- Uma linha por estudante em cada atividade: filtre pela coluna "Atividade" para a lista de presença.
create or replace view public.lista_por_atividade with (security_invoker = true) as
select
  a.titulo as "Atividade",
  a.quando as "Quando",
  i.nome as "Nome",
  i.escola as "Escola",
  i.ano_escolar as "Ano escolar",
  extract(year from age(current_date, i.data_nascimento))::int as "Idade",
  case when i.possui_deficiencia then 'Sim' else 'Não' end as "Deficiência",
  i.deficiencia as "Qual / apoio necessário",
  i.email as "E-mail",
  to_char(i.criado_em at time zone 'America/Fortaleza', 'DD/MM/YYYY HH24:MI') as "Inscrito em"
from public.atividades a
join public.inscricoes i on i.atividades @> array[a.id]
order by a.ordem, i.nome;

-- Vagas, inscritos e vagas restantes de cada atividade.
create or replace view public.resumo_vagas with (security_invoker = true) as
select
  v.titulo as "Atividade",
  coalesce(v.vagas::text, 'Sem limite') as "Vagas",
  v.inscritos as "Inscritos",
  case when v.vagas is null then '' else greatest(v.vagas - v.inscritos, 0)::text end as "Restantes",
  case when v.vagas is null or v.vagas = 0 then ''
       else round(100.0 * v.inscritos / v.vagas)::text || '%' end as "Ocupação"
from public.vagas_atividades v
order by v.ordem;

-- Estudantes inscritos por escola.
create or replace view public.resumo_escolas with (security_invoker = true) as
select
  i.escola as "Escola",
  count(*) as "Estudantes inscritos",
  count(*) filter (where i.possui_deficiencia) as "Com deficiência"
from public.inscricoes i
group by i.escola
order by count(*) desc, i.escola;

comment on view public.painel_inscricoes is 'Inscrições em formato de leitura: uma linha por estudante.';
comment on view public.lista_por_atividade is 'Lista de presença: uma linha por estudante em cada atividade.';
comment on view public.resumo_vagas is 'Vagas, inscritos e vagas restantes por atividade.';
comment on view public.resumo_escolas is 'Estudantes inscritos por escola.';

-- As visões são só para o painel do Supabase: nem a chave pública nem o site precisam delas.
revoke all on table public.painel_inscricoes, public.lista_por_atividade,
  public.resumo_vagas, public.resumo_escolas from anon, authenticated;
