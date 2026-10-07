-- Visitantes: pais, professores, moradores e turistas também se inscrevem, sem escola nem ano escolar.
-- Eles podem escolher a abertura, os painéis e a palestra; o concurso de redação e as oficinas são
-- só para estudantes (coluna `so_estudantes` da tabela `atividades`).
-- A função `inscrever_estudante` ganha o parâmetro `p_perfil`, que vale 'estudante' quando não é
-- enviado: o site publicado antes desta mudança continua funcionando.
-- Rode depois de 20261006180000_vagas_oficinas.sql.

alter table public.inscricoes
  add column if not exists perfil text not null default 'estudante'
    check (perfil in ('estudante', 'visitante'));
comment on column public.inscricoes.perfil is 'estudante ou visitante. Visitantes não têm escola nem ano escolar.';

alter table public.inscricoes alter column escola drop not null;
alter table public.inscricoes alter column ano_escolar drop not null;
alter table public.inscricoes drop constraint if exists inscricoes_dados_escolares_check;
alter table public.inscricoes add constraint inscricoes_dados_escolares_check check (
  (perfil = 'estudante' and escola is not null and ano_escolar is not null)
  or (perfil = 'visitante' and escola is null and ano_escolar is null)
);

alter table public.atividades add column if not exists so_estudantes boolean not null default false;
comment on column public.atividades.so_estudantes is 'Exclusiva para estudantes: visitantes não podem se inscrever.';
update public.atividades
   set so_estudantes = true
 where id in ('concurso-redacao', 'oficina-redacao', 'oficina-poesia', 'oficina-desenho');

drop function if exists public.inscrever_estudante(
  text, text, text, date, text, boolean, text, text[], boolean, text, text, text, text
);

-- Mesmas regras de antes. O mesmo participante é reconhecido pelo nome completo, a data de
-- nascimento e a escola; visitantes, pelo nome e a data. Um estudante e um visitante com o mesmo nome
-- e data são tratados como pessoas diferentes (aparecem em `possiveis_repetidas`).
create or replace function public.inscrever_estudante(
  p_nome text,
  p_escola text,
  p_ano_escolar text,
  p_data_nascimento date,
  p_email text,
  p_possui_deficiencia boolean,
  p_deficiencia text,
  p_atividades text[],
  p_consentimento boolean,
  p_responsavel_nome text,
  p_responsavel_cpf text,
  p_responsavel_contato text,
  p_termo_versao text,
  p_perfil text default 'estudante'
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_nome text := public.normalizar_nome(p_nome);
  v_existente public.inscricoes;
  v_novas text[];
  v_repetidas text[] := '{}';
  v_esgotadas text[];
  v_final public.inscricoes;
  v_situacao text;
  v_conflitos jsonb;
begin
  if not p_consentimento then
    raise exception 'O termo de consentimento precisa ser aceito.';
  end if;

  if p_perfil is null or p_perfil not in ('estudante', 'visitante') then
    raise exception 'Perfil desconhecido na inscrição.';
  end if;

  if exists (
    select 1 from unnest(p_atividades) as escolhida(id)
    where not exists (select 1 from public.atividades a where a.id = escolhida.id)
  ) then
    raise exception 'Atividade desconhecida na inscrição.';
  end if;

  if p_perfil = 'visitante' and exists (
    select 1 from public.atividades a where a.id = any (p_atividades) and a.so_estudantes
  ) then
    raise exception 'Atividade exclusiva para estudantes na inscrição de visitante.';
  end if;

  -- Envios simultâneos do mesmo participante esperam a vez.
  perform pg_advisory_xact_lock(hashtextextended(v_nome || '|' || p_data_nascimento::text, 0));

  -- Mesmo nome e data, mas escola diferente (ou um estudante e um visitante), é outra pessoa.
  select i.* into v_existente
    from public.inscricoes i
   where i.data_nascimento = p_data_nascimento
     and public.normalizar_nome(i.nome) = v_nome
     and i.perfil = p_perfil
     and public.normalizar_nome(i.escola) is not distinct from public.normalizar_nome(p_escola)
   order by i.criado_em
   limit 1
   for update;

  if found then
    select coalesce(array_agg(x), '{}') into v_novas
      from unnest(p_atividades) x where not (x = any (v_existente.atividades));
    select coalesce(array_agg(x), '{}') into v_repetidas
      from unnest(p_atividades) x where x = any (v_existente.atividades);
    if cardinality(v_novas) = 0 then
      return jsonb_build_object(
        'situacao', 'nada_novo', 'esgotadas', '[]'::jsonb, 'repetidas', to_jsonb(v_repetidas),
        'atividades', to_jsonb(v_existente.atividades), 'nome', v_existente.nome,
        'escola', v_existente.escola, 'ano_escolar', v_existente.ano_escolar,
        'data_nascimento', v_existente.data_nascimento, 'responsavel_nome', v_existente.responsavel_nome,
        'perfil', v_existente.perfil);
    end if;
  else
    v_novas := p_atividades;
  end if;

  -- Atividades no mesmo horário, contando as que o participante já tinha e as escolhidas agora.
  select coalesce(jsonb_agg(jsonb_build_array(s.atividade_a, s.atividade_b)), '[]'::jsonb) into v_conflitos
    from public.atividades_simultaneas s
   where s.atividade_a = any (coalesce(v_existente.atividades, '{}') || p_atividades)
     and s.atividade_b = any (coalesce(v_existente.atividades, '{}') || p_atividades);
  if jsonb_array_length(v_conflitos) > 0 then
    return jsonb_build_object(
      'situacao', 'conflito', 'conflitos', v_conflitos, 'esgotadas', '[]'::jsonb,
      'repetidas', to_jsonb(v_repetidas));
  end if;

  -- Trava as atividades novas: inscrições simultâneas nas mesmas atividades esperam a vez,
  -- então a contagem abaixo nunca deixa passar do limite.
  perform 1 from public.atividades a where a.id = any (v_novas) order by a.id for update;

  select coalesce(array_agg(a.id order by a.ordem), '{}') into v_esgotadas
    from public.atividades a
   where a.id = any (v_novas)
     and a.vagas is not null
     and (select count(*) from public.inscricoes i where i.atividades @> array[a.id]) >= a.vagas;

  if cardinality(v_esgotadas) > 0 then
    return jsonb_build_object(
      'situacao', 'esgotadas', 'esgotadas', to_jsonb(v_esgotadas), 'repetidas', to_jsonb(v_repetidas));
  end if;

  if v_existente.id is not null then
    update public.inscricoes i
       set atividades = (
             select array_agg(a.id order by a.ordem) from public.atividades a
              where a.id = any (v_existente.atividades || v_novas)),
           responsavel_nome = coalesce(i.responsavel_nome, p_responsavel_nome),
           responsavel_cpf = coalesce(i.responsavel_cpf, p_responsavel_cpf),
           responsavel_contato = coalesce(i.responsavel_contato, p_responsavel_contato),
           termo_versao = coalesce(i.termo_versao, p_termo_versao),
           termo_aceito_em = coalesce(i.termo_aceito_em, now())
     where i.id = v_existente.id
    returning i.* into v_final;
    v_situacao := 'acrescentada';
  else
    insert into public.inscricoes (
      perfil, nome, escola, ano_escolar, data_nascimento, email,
      possui_deficiencia, deficiencia, atividades, consentimento,
      responsavel_nome, responsavel_cpf, responsavel_contato, termo_versao, termo_aceito_em
    ) values (
      p_perfil, p_nome, p_escola, p_ano_escolar, p_data_nascimento, p_email,
      p_possui_deficiencia, p_deficiencia, p_atividades, p_consentimento,
      p_responsavel_nome, p_responsavel_cpf, p_responsavel_contato, p_termo_versao, now()
    )
    returning * into v_final;
    v_situacao := 'nova';
  end if;

  return jsonb_build_object(
    'situacao', v_situacao, 'esgotadas', '[]'::jsonb, 'repetidas', to_jsonb(v_repetidas),
    'atividades', to_jsonb(v_final.atividades), 'nome', v_final.nome, 'escola', v_final.escola,
    'ano_escolar', v_final.ano_escolar, 'data_nascimento', v_final.data_nascimento,
    'responsavel_nome', v_final.responsavel_nome, 'perfil', v_final.perfil);
end;
$$;

revoke execute on function public.inscrever_estudante(
  text, text, text, date, text, boolean, text, text[], boolean, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.inscrever_estudante(
  text, text, text, date, text, boolean, text, text[], boolean, text, text, text, text, text
) to service_role;

-- Nas visões da comissão, a coluna "Escola" mostra "Visitante" para quem não é estudante.
create or replace view public.painel_inscricoes with (security_invoker = true) as
select
  row_number() over (order by i.criado_em) as "Nº",
  to_char(i.criado_em at time zone 'America/Fortaleza', 'DD/MM/YYYY HH24:MI') as "Inscrito em",
  i.nome as "Nome",
  extract(year from age(current_date, i.data_nascimento))::int as "Idade",
  to_char(i.data_nascimento, 'DD/MM/YYYY') as "Nascimento",
  coalesce(i.escola, 'Visitante') as "Escola",
  i.ano_escolar as "Ano escolar",
  (select string_agg(a.titulo, '; ' order by a.ordem)
     from public.atividades a
    where a.id = any (i.atividades)) as "Atividades",
  case when i.possui_deficiencia then 'Sim' else 'Não' end as "Deficiência",
  i.deficiencia as "Qual / apoio necessário",
  i.email as "E-mail",
  i.id as "Código",
  i.responsavel_nome as "Responsável",
  case when i.responsavel_cpf is not null
       then substr(i.responsavel_cpf, 1, 3) || '.' || substr(i.responsavel_cpf, 4, 3) || '.'
            || substr(i.responsavel_cpf, 7, 3) || '-' || substr(i.responsavel_cpf, 10, 2)
  end as "CPF do responsável",
  i.responsavel_contato as "Contato do responsável",
  to_char(i.termo_aceito_em at time zone 'America/Fortaleza', 'DD/MM/YYYY HH24:MI') as "Termo aceito em",
  i.termo_versao as "Versão do termo"
from public.inscricoes i
order by i.criado_em;

create or replace view public.lista_por_atividade with (security_invoker = true) as
select
  a.titulo as "Atividade",
  a.quando as "Quando",
  i.nome as "Nome",
  coalesce(i.escola, 'Visitante') as "Escola",
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

-- Visitantes aparecem numa linha só, "Visitantes". A coluna "Estudantes inscritos" passa a se
-- chamar "Inscritos" (por isso a visão é recriada).
drop view if exists public.resumo_escolas;
create view public.resumo_escolas with (security_invoker = true) as
select
  coalesce(i.escola, 'Visitantes') as "Escola",
  count(*) as "Inscritos",
  count(*) filter (where i.possui_deficiencia) as "Com deficiência"
from public.inscricoes i
group by coalesce(i.escola, 'Visitantes')
order by count(*) desc, coalesce(i.escola, 'Visitantes');
comment on view public.resumo_escolas is 'Inscritos por escola; os visitantes aparecem juntos.';

create or replace view public.possiveis_repetidas with (security_invoker = true) as
select
  case when a.data_nascimento = b.data_nascimento
       then 'Mesma data de nascimento e mesmo primeiro nome'
       else 'Mesmo nome com data de nascimento diferente' end as "Motivo",
  a.nome as "Nome 1",
  to_char(a.data_nascimento, 'DD/MM/YYYY') as "Nascimento 1",
  coalesce(a.escola, 'Visitante') as "Escola 1",
  b.nome as "Nome 2",
  to_char(b.data_nascimento, 'DD/MM/YYYY') as "Nascimento 2",
  coalesce(b.escola, 'Visitante') as "Escola 2",
  a.id as "Código 1",
  b.id as "Código 2"
from public.inscricoes a
join public.inscricoes b on a.id < b.id
where (a.data_nascimento = b.data_nascimento
       and split_part(public.normalizar_nome(a.nome), ' ', 1) = split_part(public.normalizar_nome(b.nome), ' ', 1))
   or (a.data_nascimento <> b.data_nascimento
       and public.normalizar_nome(a.nome) = public.normalizar_nome(b.nome))
order by a.nome, b.nome;

revoke all on table public.painel_inscricoes, public.lista_por_atividade,
  public.resumo_escolas, public.possiveis_repetidas from anon, authenticated;
