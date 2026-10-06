-- Termo de Consentimento, Participação e Autorização de Uso de Imagem e Voz, e atividades no mesmo horário.
-- Guarda os dados do responsável legal (exigidos para menores de 18 anos), a versão do termo aceita
-- e a data do aceite, que é o registro eletrônico do consentimento.
-- Impede que o mesmo estudante fique inscrito em duas atividades que acontecem no mesmo horário,
-- inclusive quando acrescenta uma atividade depois.
-- Troca a função `inscrever_estudante` pela versão com esses dados; o site publicado antes desta
-- mudança usa `registrar_inscricao`, que continua funcionando. Rode depois de
-- 20261006140000_programacao_atualizada.sql.

alter table public.inscricoes
  add column if not exists responsavel_nome text check (char_length(responsavel_nome) <= 120),
  add column if not exists responsavel_cpf text check (responsavel_cpf ~ '^[0-9]{11}$'),
  add column if not exists responsavel_contato text check (char_length(responsavel_contato) <= 120),
  add column if not exists termo_versao text check (char_length(termo_versao) <= 40),
  add column if not exists termo_aceito_em timestamptz;

comment on column public.inscricoes.termo_versao is 'Versão do termo de consentimento aceita (lib/termo.ts do site).';
comment on column public.inscricoes.termo_aceito_em is 'Data e hora do aceite do termo.';

-- Pares de atividades que acontecem no mesmo horário (a mesma lista está em lib/programacao.ts do site).
create table if not exists public.atividades_simultaneas (
  atividade_a text not null references public.atividades (id),
  atividade_b text not null references public.atividades (id),
  primary key (atividade_a, atividade_b)
);
comment on table public.atividades_simultaneas is 'Atividades no mesmo horário: o estudante só pode escolher uma de cada par.';

insert into public.atividades_simultaneas (atividade_a, atividade_b) values
  ('oficina-redacao', 'painel-1'),
  ('oficina-poesia', 'painel-3'),
  ('oficina-desenho', 'painel-4')
on conflict do nothing;

alter table public.atividades_simultaneas enable row level security;
revoke all on table public.atividades_simultaneas from anon, authenticated;
grant select on table public.atividades_simultaneas to service_role;

drop function if exists public.inscrever_estudante(text, text, text, date, text, boolean, text, text[], boolean);

-- Mesmas regras de antes (repetição bloqueada por atividade, vagas conferidas na mesma operação),
-- agora gravando o responsável e o aceite do termo. Numa inscrição complementada, os dados da
-- primeira inscrição são mantidos; só são preenchidos os dados de responsável e termo que faltavam.
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
  p_termo_versao text
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

  if exists (
    select 1 from unnest(p_atividades) as escolhida(id)
    where not exists (select 1 from public.atividades a where a.id = escolhida.id)
  ) then
    raise exception 'Atividade desconhecida na inscrição.';
  end if;

  -- Envios simultâneos do mesmo estudante esperam a vez.
  perform pg_advisory_xact_lock(hashtextextended(v_nome || '|' || p_data_nascimento::text, 0));

  -- Mesmo nome e data, mas escola diferente, é tratado como outra pessoa.
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
        'data_nascimento', v_existente.data_nascimento, 'responsavel_nome', v_existente.responsavel_nome);
    end if;
  else
    v_novas := p_atividades;
  end if;

  -- Atividades no mesmo horário, contando as que o estudante já tinha e as escolhidas agora.
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
      nome, escola, ano_escolar, data_nascimento, email,
      possui_deficiencia, deficiencia, atividades, consentimento,
      responsavel_nome, responsavel_cpf, responsavel_contato, termo_versao, termo_aceito_em
    ) values (
      p_nome, p_escola, p_ano_escolar, p_data_nascimento, p_email,
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
    'responsavel_nome', v_final.responsavel_nome);
end;
$$;

revoke execute on function public.inscrever_estudante(
  text, text, text, date, text, boolean, text, text[], boolean, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.inscrever_estudante(
  text, text, text, date, text, boolean, text, text[], boolean, text, text, text, text
) to service_role;
grant update (responsavel_nome, responsavel_cpf, responsavel_contato, termo_versao, termo_aceito_em)
  on table public.inscricoes to service_role;

-- Painel da comissão ganha o responsável e o aceite do termo (colunas novas no fim).
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

revoke all on table public.painel_inscricoes from anon, authenticated;
