-- Cada oficina tem 25 vagas (redação, poesia e desenho criativo).
-- O site lê as vagas daqui: depois de rodar, o formulário passa a mostrar as vagas restantes.
-- Rode depois de 20261006170000_remover_concurso_desenho.sql.

update public.atividades
   set vagas = 25
 where id in ('oficina-redacao', 'oficina-poesia', 'oficina-desenho');
