import "server-only";
import { createClient } from "@supabase/supabase-js";

/*
 * Cliente do Supabase para uso exclusivo no servidor.
 * A chave secreta ignora as regras de acesso (RLS) do banco, por isso fica só em variáveis de
 * ambiente sem o prefixo NEXT_PUBLIC_ e nunca chega ao navegador. Retorna null se não configurado.
 */
export function clienteSupabase() {
  const url = process.env.SUPABASE_URL;
  const chaveSecreta = process.env.SUPABASE_SECRET_KEY;
  if (!url || !chaveSecreta) return null;

  return createClient(url, chaveSecreta, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
