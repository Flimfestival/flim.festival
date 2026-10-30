-- Mesa redonda "Mulheres Lendo Mulheres" (Mulherio das Letras, Regional Zila Mamede): sábado, 12/12, na
-- Casa de Cultura, com 110 vagas e inscrição pelo site, aberta a estudantes e visitantes. O horário
-- ainda será definido; quando for, atualize a coluna `quando` (e, se coincidir com algum painel ou
-- oficina, cadastre o par em `atividades_simultaneas`).
-- Não mexe nas inscrições feitas. Pode ser rodado mais de uma vez.
-- Rode depois de 20261014120000_lancamento_de_livros.sql.

do $$
begin
  if not exists (select 1 from public.atividades where id = 'mesa-redonda') then
    -- Abre espaço na ordem das atividades, logo depois do último painel.
    update public.atividades
       set ordem = ordem + 1
     where ordem > (select ordem from public.atividades where id = 'painel-4');
    insert into public.atividades (id, titulo, vagas, ordem, quando, so_estudantes)
    select 'mesa-redonda', 'Mesa redonda: Mulheres Lendo Mulheres', 110, ordem + 1,
           '12/12 (sáb), horário a definir · Casa de Cultura', false
      from public.atividades
     where id = 'painel-4';
  end if;
end $$;
