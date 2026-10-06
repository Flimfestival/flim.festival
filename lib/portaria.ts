import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/*
 * Acesso da comissão ao painel da portaria (/portaria), com uma senha única.
 * A senha fica na variável de ambiente SENHA_PORTARIA (veja o README). Depois do login, um cookie
 * assinado vale por 12 horas; trocar a senha encerra todas as sessões abertas.
 */
const COOKIE = "flim_portaria";
const DURACAO_SEGUNDOS = 12 * 60 * 60;

const senha = () => process.env.SENHA_PORTARIA ?? "";

// Senhas curtas demais deixam o painel desativado, para ninguém publicar com uma senha fraca.
export const portariaConfigurada = () => senha().length >= 12;

const assinar = (texto: string) => createHmac("sha256", senha()).update(texto).digest("base64url");

// Compara sem revelar, pelo tempo de resposta, quantos caracteres estão certos.
function iguais(a: string, b: string) {
  const resumo = (texto: string) => createHash("sha256").update(texto).digest();
  return timingSafeEqual(resumo(a), resumo(b));
}

export const senhaCorreta = (tentativa: string) => portariaConfigurada() && iguais(tentativa, senha());

export async function abrirSessao() {
  const expira = String(Date.now() + DURACAO_SEGUNDOS * 1000);
  (await cookies()).set(COOKIE, `${expira}.${assinar(expira)}`, {
    httpOnly: true,
    secure: process.env.VERCEL === "1",
    sameSite: "strict",
    path: "/portaria",
    maxAge: DURACAO_SEGUNDOS,
  });
}

export async function fecharSessao() {
  (await cookies()).delete({ name: COOKIE, path: "/portaria" });
}

export async function sessaoValida() {
  if (!portariaConfigurada()) return false;
  const [expira, assinatura] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  if (!expira || !assinatura || Number(expira) < Date.now()) return false;
  return iguais(assinatura, assinar(expira));
}
