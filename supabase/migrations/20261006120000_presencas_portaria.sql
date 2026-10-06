-- Presenças registradas pela comissão no painel da portaria (/portaria do site).
-- Uma entrada por estudante em cada atividade. Rode depois de 20261005150000_bloquear_inscricao_repetida.sql.

create table if not exists public.presencas (
  inscricao_id uuid not null references public.inscricoes (id) on delete cascade,
  atividade_id text not null references public.atividades (id),
  registrada_em timestamptz not null default now(),
  primary key (inscricao_id, atividade_id)
);

comment on table public.presencas is 'Entradas registradas na portaria: uma por estudante em cada atividade.';

create index if not exists presencas_atividade_idx on public.presencas (atividade_id);

-- Registra a entrada de um estudante inscrito na atividade. Se a entrada já existia (outro celular
-- registrou antes, por exemplo), não duplica: devolve a hora original e `nova` = false.
create or replace function public.registrar_presenca(p_inscricao uuid, p_atividade text)
returns table (hora timestamptz, nova boolean)
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.inscricoes i
    where i.id = p_inscricao and i.atividades @> array[p_atividade]
  ) then
    raise exception 'Inscrição não encontrada nesta atividade.' using errcode = 'P0002';
  end if;

  return query
    insert into public.presencas as p (inscricao_id, atividade_id)
    values (p_inscricao, p_atividade)
    on conflict on constraint presencas_pkey do nothing
    returning p.registrada_em, true;

  if not found then
    return query
      select p.registrada_em, false
      from public.presencas p
      where p.inscricao_id = p_inscricao and p.atividade_id = p_atividade;
  end if;
end;
$$;

-- Acesso: só o servidor do site, com a chave secreta. A chave pública não vê nada disto.
alter table public.presencas enable row level security;
revoke all on table public.presencas from anon, authenticated;
grant select, insert, delete on table public.presencas to service_role;
revoke execute on function public.registrar_presenca(uuid, text) from public, anon, authenticated;
grant execute on function public.registrar_presenca(uuid, text) to service_role;

-- Visões da comissão passam a mostrar as presenças (colunas novas no fim).
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
  to_char(i.criado_em at time zone 'America/Fortaleza', 'DD/MM/YYYY HH24:MI') as "Inscrito em",
  coalesce(
    'Sim, ' || to_char(p.registrada_em at time zone 'America/Fortaleza', 'DD/MM HH24:MI'),
    'Não'
  ) as "Presente"
from public.atividades a
join public.inscricoes i on i.atividades @> array[a.id]
left join public.presencas p on p.inscricao_id = i.id and p.atividade_id = a.id
order by a.ordem, i.nome;

create or replace view public.resumo_vagas with (security_invoker = true) as
select
  v.titulo as "Atividade",
  coalesce(v.vagas::text, 'Sem limite') as "Vagas",
  v.inscritos as "Inscritos",
  case when v.vagas is null then '' else greatest(v.vagas - v.inscritos, 0)::text end as "Restantes",
  case when v.vagas is null or v.vagas = 0 then ''
       else round(100.0 * v.inscritos / v.vagas)::text || '%' end as "Ocupação",
  (select count(*) from public.presencas p where p.atividade_id = v.id) as "Presentes"
from public.vagas_atividades v
order by v.ordem;

revoke all on table public.lista_por_atividade, public.resumo_vagas from anon, authenticated;
