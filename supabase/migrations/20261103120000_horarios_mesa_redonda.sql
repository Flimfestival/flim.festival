-- Horários da tarde de sábado (12/12) na Casa de Cultura, com a mesa redonda entre os painéis:
-- 14h15 painel "Escreva, leia... eternize-se", 15h15 mesa redonda (60 minutos), 16h15 Xaxado e 16h30
-- painel "Povo, natureza e poesia" (antes às 15h45). A palestra de Socorro Acioli continua às 17h30.
-- A mesa coincide com as oficinas de poesia (14h) e de desenho criativo (15h30): o par só é cadastrado
-- se ninguém já estiver inscrito nas duas atividades.
-- Não mexe nas inscrições feitas. Pode ser rodado mais de uma vez.
-- Rode depois de 20261030120000_mesa_redonda.sql.

update public.atividades a
   set quando = v.quando, ordem = v.ordem
  from (values
    ('mesa-redonda', '12/12 (sáb), 15h15 · Casa de Cultura', 5),
    ('painel-4', '12/12 (sáb), 16h30 · Casa de Cultura', 6)
  ) as v(id, quando, ordem)
 where a.id = v.id;

insert into public.atividades_simultaneas (atividade_a, atividade_b)
select v.a, v.b
  from (values ('oficina-poesia', 'mesa-redonda'), ('oficina-desenho', 'mesa-redonda')) as v(a, b)
 where not exists (select 1 from public.inscricoes i where i.atividades @> array[v.a, v.b])
on conflict do nothing;
