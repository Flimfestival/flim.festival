-- Limite de tentativas por conexão, contra envios em massa (por exemplo, um programa enviando
-- inscrições falsas para esgotar as vagas) e contra tentativas repetidas de senha na portaria.
-- O site guarda só um código embaralhado do endereço de quem envia (nunca o endereço em si), e os
-- registros são apagados depois de 1 dia. Rode depois de 20261006150000_termo_e_horarios.sql.

create table if not exists public.limites_envio (
  chave text not null check (char_length(chave) <= 120),
  criado_em timestamptz not null default now()
);

create index if not exists limites_envio_chave_idx on public.limites_envio (chave, criado_em);
create index if not exists limites_envio_criado_em_idx on public.limites_envio (criado_em);

comment on table public.limites_envio is 'Tentativas recentes por conexão (código embaralhado), apagadas depois de 1 dia.';

-- Registra uma tentativa e diz se ela está dentro do limite (true) ou se deve ser recusada (false).
create or replace function public.consumir_limite(p_chave text, p_limite integer, p_janela_segundos integer)
returns boolean
language plpgsql
set search_path = ''
as $$
declare
  v_tentativas integer;
begin
  -- Tentativas simultâneas da mesma conexão esperam a vez, para a contagem não falhar.
  perform pg_advisory_xact_lock(hashtextextended('limite|' || p_chave, 0));

  delete from public.limites_envio where criado_em < now() - interval '1 day';

  select count(*) into v_tentativas
    from public.limites_envio l
   where l.chave = p_chave
     and l.criado_em > now() - make_interval(secs => p_janela_segundos);

  if v_tentativas >= p_limite then
    return false;
  end if;

  insert into public.limites_envio (chave) values (p_chave);
  return true;
end;
$$;

alter table public.limites_envio enable row level security;
revoke all on table public.limites_envio from anon, authenticated;
grant select, insert, delete on table public.limites_envio to service_role;
revoke execute on function public.consumir_limite(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consumir_limite(text, integer, integer) to service_role;
