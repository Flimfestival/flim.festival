"use client";

import { useActionState } from "react";
import { entrar } from "@/app/portaria/actions";

export default function LoginPortaria() {
  const [estado, acao, enviando] = useActionState(entrar, null);

  return (
    <form action={acao} className="form-card portaria-login">
      <h1>Entrada da comissão</h1>
      <p className="dica">Use a senha da comissão para consultar os inscritos e registrar as entradas.</p>
      {estado?.erro && (
        <p role="alert" className="form-alerta">
          {estado.erro}
        </p>
      )}
      <div className="campo">
        <label htmlFor="senha">Senha da comissão</label>
        <input id="senha" name="senha" type="password" autoComplete="current-password" required />
      </div>
      <button type="submit" className="btn btn-primary form-enviar" disabled={enviando}>
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
