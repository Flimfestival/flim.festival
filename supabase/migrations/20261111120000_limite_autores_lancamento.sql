-- Lançamento de livros: no máximo 15 autores, cada um com 20 minutos para lançar quantos livros quiser.
-- O autor é identificado pelo e-mail (sem diferenciar maiúsculas). Quem já tem um livro inscrito pode
-- incluir outros mesmo depois de preenchidas as 15 vagas; um e-mail novo é recusado com o código FL001,
-- que o site mostra como "vagas preenchidas".
-- O número 15 também aparece no site, em lib/lancamento.ts (vagasAutores): mude nos dois lugares.
-- Não mexe nos livros já inscritos. Pode ser rodado mais de uma vez.
-- Rode depois de 20261103120000_horarios_mesa_redonda.sql.

create or replace function public.limitar_autores_lancamento()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Um envio por vez decide a última vaga, mesmo com dois autores enviando no mesmo instante.
  perform pg_advisory_xact_lock(hashtextextended('lancamentos_livros|autores', 0));

  if exists (select 1 from public.lancamentos_livros where lower(email) = lower(new.email)) then
    return new;
  end if;

  if (select count(distinct lower(email)) from public.lancamentos_livros) >= 15 then
    raise exception 'As vagas de autores para o lançamento de livros estão preenchidas.'
      using errcode = 'FL001';
  end if;

  return new;
end;
$$;

revoke all on function public.limitar_autores_lancamento() from public, anon, authenticated;

drop trigger if exists limitar_autores_lancamento on public.lancamentos_livros;
create trigger limitar_autores_lancamento
  before insert on public.lancamentos_livros
  for each row execute function public.limitar_autores_lancamento();

comment on function public.limitar_autores_lancamento() is
  'Lançamento de livros: recusa um 16º autor (e-mail novo) com o código FL001.';
