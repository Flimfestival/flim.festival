-- Os painéis passam a ser chamados pelo nome, sem o número ("1º painel: ..." vira "Painel: ...").
-- Muda só o texto exibido nas visões da comissão; os códigos (painel-1 a painel-4) continuam iguais.
-- Rode depois de 20261007120000_visitantes.sql.

update public.atividades a
   set titulo = v.titulo
  from (values
    ('painel-1', 'Painel: Literatura e identidade'),
    ('painel-2', 'Painel: Educação, oportunidade e evolução'),
    ('painel-3', 'Painel: Escreva, leia... eternize-se'),
    ('painel-4', 'Painel: Povo, natureza e poesia')
  ) as v(id, titulo)
 where a.id = v.id;
