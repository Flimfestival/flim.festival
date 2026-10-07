-- Oficinas abertas a todos e oficina de estratégias de leitura (BALE).
-- 1. Só o concurso de redação continua exclusivo para estudantes (das escolas de Martins): as oficinas
--    passam a aceitar visitantes e estudantes de outras escolas.
-- 2. Nova oficina "Estratégias de leitura e contação de histórias", do Programa de Extensão Biblioteca
--    Ambulante e Literatura nas Escolas (BALE), da UERN, para professores e mediadores: 25 vagas,
--    sábado 12/12 às 10h30, no Colégio Estadual Almino Afonso, no horário do painel Literatura e
--    identidade.
-- 3. A oficina de redação passa a se chamar como no cronograma: "Dissertar: da ideia ao texto".
-- Não mexe nas inscrições feitas. Pode ser rodado mais de uma vez.
-- Rode depois de 20261007130000_nomes_dos_paineis.sql.

update public.atividades
   set so_estudantes = false
 where id in ('oficina-redacao', 'oficina-poesia', 'oficina-desenho');

do $$
begin
  if not exists (select 1 from public.atividades where id = 'oficina-leitura') then
    -- Abre espaço na ordem das atividades, logo depois da oficina de redação.
    update public.atividades
       set ordem = ordem + 1
     where ordem > (select ordem from public.atividades where id = 'oficina-redacao');
    insert into public.atividades (id, titulo, vagas, ordem, quando, so_estudantes)
    select 'oficina-leitura', 'Oficina de estratégias de leitura e contação de histórias', 25,
           ordem + 1, '12/12 (sáb), 10h30 · Colégio Estadual Almino Afonso', false
      from public.atividades
     where id = 'oficina-redacao';
  end if;
end $$;

insert into public.atividades_simultaneas (atividade_a, atividade_b)
values ('oficina-leitura', 'painel-1')
on conflict do nothing;

update public.atividades
   set titulo = 'Oficina Dissertar: da ideia ao texto'
 where id = 'oficina-redacao';
