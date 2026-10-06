-- Bloqueia uma segunda inscrição do mesmo estudante (mesmo nome e data de nascimento),
-- para que ninguém ocupe duas vagas da mesma atividade por engano.
-- A comparação ignora maiúsculas e espaços repetidos. Mantém as permissões da função.
-- Rode depois de 20261005140000_visoes_para_organizacao.sql.

create index if not exists inscricoes_data_nascimento_idx on public.inscricoes (data_nascimento);

create or replace function public.registrar_inscricao(
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
  v_nome text := lower(regexp_replace(btrim(p_nome), '\s+', ' ', 'g'));
begin
  if exists (
    select 1 from unnest(p_atividades) as escolhida(id)
    where not exists (select 1 from public.atividades a where a.id = escolhida.id)
  ) then
    raise exception 'Atividade desconhecida na inscrição.';
  end if;

  -- Envios simultâneos do mesmo estudante esperam a vez, para a conferência abaixo valer sempre.
  perform pg_advisory_xact_lock(hashtextextended(v_nome || '|' || p_data_nascimento::text, 0));

  if exists (
    select 1 from public.inscricoes i
    where i.data_nascimento = p_data_nascimento
      and lower(regexp_replace(btrim(i.nome), '\s+', ' ', 'g')) = v_nome
  ) then
    raise exception 'Este estudante já está inscrito.' using errcode = '23505';
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
