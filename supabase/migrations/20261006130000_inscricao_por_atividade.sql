-- Uma inscrição por estudante; a repetição é bloqueada por atividade.
-- É o mesmo estudante só quando coincidem, ao mesmo tempo: o nome completo (ignorando apenas acentos,
-- maiúsculas e pontuação), a data de nascimento e a escola. Nomes parecidos nunca são juntados.
-- Quando o mesmo estudante se inscreve de novo, as atividades novas são acrescentadas à inscrição que
-- já existe e as repetidas são ignoradas. Os dados da primeira inscrição (ano, e-mail) são mantidos.
-- Cria a função nova `inscrever_estudante`; a antiga continua existindo para o site anterior
-- funcionar até a publicação. Rode depois de 20261006120000_presencas_portaria.sql.

-- Nome sem acentos, maiúsculas, pontuação e espaços repetidos: "  João  P. Lima" vira "joao p lima".
create or replace function public.normalizar_nome(p_nome text)
returns text
language sql
immutable
set search_path = ''
as $$
  select btrim(regexp_replace(regexp_replace(
    translate(lower(p_nome), 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn'),
    '[^a-z0-9 ]', ' ', 'g'), '\s+', ' ', 'g'))
$$;

-- Grava ou complementa a inscrição numa única operação, conferindo as vagas.
-- Devolve um JSON com:
--   situacao: 'nova' | 'acrescentada' | 'nada_novo' | 'esgotadas'
--   esgotadas: atividades sem vaga (nada é gravado nesse caso)
--   repetidas: atividades em que o estudante já estava inscrito
--   atividades, nome, escola, ano_escolar, data_nascimento: a inscrição como ficou gravada
create or replace function public.inscrever_estudante(
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
begin
  if exists (
    select 1 from unnest(p_atividades) as escolhida(id)
    where not exists (select 1 from public.atividades a where a.id = escolhida.id)
  ) then
    raise exception 'Atividade desconhecida na inscrição.';
  end if;

  -- Envios simultâneos do mesmo estudante esperam a vez.
  perform pg_advisory_xact_lock(hashtextextended(v_nome || '|' || p_data_nascimento::text, 0));

  -- Mesmo nome e data, mas escola diferente, é tratado como outra pessoa (inscrição separada,
  -- que aparece em `possiveis_repetidas` para a comissão conferir).
  select i.* into v_existente
    from public.inscricoes i
   where i.data_nascimento = p_data_nascimento
     and public.normalizar_nome(i.nome) = v_nome
     and public.normalizar_nome(i.escola) = public.normalizar_nome(p_escola)
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
        'data_nascimento', v_existente.data_nascimento);
    end if;
  else
    v_novas := p_atividades;
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
          where a.id = any (v_existente.atividades || v_novas))
     where i.id = v_existente.id
    returning i.* into v_final;
    v_situacao := 'acrescentada';
  else
    insert into public.inscricoes (
      nome, escola, ano_escolar, data_nascimento, email,
      possui_deficiencia, deficiencia, atividades, consentimento
    ) values (
      p_nome, p_escola, p_ano_escolar, p_data_nascimento, p_email,
      p_possui_deficiencia, p_deficiencia, p_atividades, p_consentimento
    )
    returning * into v_final;
    v_situacao := 'nova';
  end if;

  return jsonb_build_object(
    'situacao', v_situacao, 'esgotadas', '[]'::jsonb, 'repetidas', to_jsonb(v_repetidas),
    'atividades', to_jsonb(v_final.atividades), 'nome', v_final.nome, 'escola', v_final.escola,
    'ano_escolar', v_final.ano_escolar, 'data_nascimento', v_final.data_nascimento);
end;
$$;

-- Acesso: só o servidor do site. A função acrescenta atividades, por isso precisa de update nessa coluna.
revoke execute on function public.normalizar_nome(text) from public, anon, authenticated;
grant execute on function public.normalizar_nome(text) to service_role;
revoke execute on function public.inscrever_estudante(text, text, text, date, text, boolean, text, text[], boolean)
  from public, anon, authenticated;
grant execute on function public.inscrever_estudante(text, text, text, date, text, boolean, text, text[], boolean)
  to service_role;
grant update (atividades) on table public.inscricoes to service_role;

-- Possíveis inscrições repetidas, para a comissão revisar (nada é bloqueado automaticamente):
--   mesma data de nascimento e mesmo primeiro nome (ex.: "Maria C. Souza" e "Maria Clara Souza");
--   mesmo nome e data de nascimento diferente (ex.: data digitada errada).
-- Gêmeos aparecem aqui também; por isso a decisão fica com a comissão.
create or replace view public.possiveis_repetidas with (security_invoker = true) as
select
  case when a.data_nascimento = b.data_nascimento
       then 'Mesma data de nascimento e mesmo primeiro nome'
       else 'Mesmo nome com data de nascimento diferente' end as "Motivo",
  a.nome as "Nome 1",
  to_char(a.data_nascimento, 'DD/MM/YYYY') as "Nascimento 1",
  a.escola as "Escola 1",
  b.nome as "Nome 2",
  to_char(b.data_nascimento, 'DD/MM/YYYY') as "Nascimento 2",
  b.escola as "Escola 2",
  a.id as "Código 1",
  b.id as "Código 2"
from public.inscricoes a
join public.inscricoes b on a.id < b.id
where (a.data_nascimento = b.data_nascimento
       and split_part(public.normalizar_nome(a.nome), ' ', 1) = split_part(public.normalizar_nome(b.nome), ' ', 1))
   or (a.data_nascimento <> b.data_nascimento
       and public.normalizar_nome(a.nome) = public.normalizar_nome(b.nome))
order by a.nome, b.nome;

comment on view public.possiveis_repetidas is
  'Pares de inscrições que podem ser do mesmo estudante, para a comissão revisar.';
revoke all on table public.possiveis_repetidas from anon, authenticated;
