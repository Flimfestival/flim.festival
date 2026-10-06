-- O concurso de desenho deixa de ter inscrição pelo site: as inscrições são feitas em papel.
-- Remove a atividade da lista do banco (e dos relatórios da comissão), só se ninguém estiver
-- inscrito nela nem com entrada registrada. Rode depois de 20261006160000_limite_de_envios.sql.

delete from public.atividades a
 where a.id = 'concurso-desenho'
   and not exists (select 1 from public.inscricoes i where i.atividades @> array['concurso-desenho'])
   and not exists (select 1 from public.presencas p where p.atividade_id = 'concurso-desenho');
