-- Permissões do servidor do site, que usa a chave secreta (papel service_role).
-- Projetos novos do Supabase não liberam automaticamente as tabelas criadas por SQL,
-- então liberamos só o que o site usa: ler as vagas e gravar inscrições pela função.
-- Rode depois de 20261005120000_criar_inscricoes.sql.

grant usage on schema public to service_role;

-- `update` é exigido porque a função trava as atividades escolhidas (select ... for update)
-- enquanto confere as vagas. O site não altera atividades.
grant select, update on table public.atividades to service_role;
grant select, insert on table public.inscricoes to service_role;
grant select on table public.vagas_atividades to service_role;
