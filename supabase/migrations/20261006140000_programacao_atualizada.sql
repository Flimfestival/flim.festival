-- Atualiza dia, horário, local e ordem das atividades conforme a programação completa de 2026:
-- as oficinas passam para sábado, 12/12, e o concurso de desenho acontece nas escolas.
-- Só altera textos usados nas listas da comissão; não mexe em inscrições nem em vagas.
-- Rode depois de 20261006130000_inscricao_por_atividade.sql.

update public.atividades a
   set quando = v.quando, ordem = v.ordem
  from (values
    ('abertura', '11/12 (sex), a partir das 16h · Mirante do Canto', 1),
    ('painel-1', '12/12 (sáb), 9h30 · Casa de Cultura', 2),
    ('painel-2', '12/12 (sáb), 11h30 · Casa de Cultura', 3),
    ('painel-3', '12/12 (sáb), 14h15 · Casa de Cultura', 4),
    ('painel-4', '12/12 (sáb), 15h45 · Casa de Cultura', 5),
    ('palestra-socorro-acioli', '12/12 (sáb), 17h30 · Casa de Cultura', 6),
    ('oficina-redacao', '12/12 (sáb), 9h · Colégio Estadual Almino Afonso', 7),
    ('oficina-poesia', '12/12 (sáb), 14h · Colégio Estadual Almino Afonso', 8),
    ('oficina-desenho', '12/12 (sáb), 15h30 · Colégio Estadual Almino Afonso', 9),
    ('concurso-redacao', '13/12 (dom), 9h · Colégio Estadual Almino Afonso', 10),
    ('concurso-desenho', 'Nas escolas, em data combinada · premiação 12/12 (sáb), 16h', 11)
  ) as v(id, quando, ordem)
 where a.id = v.id;
