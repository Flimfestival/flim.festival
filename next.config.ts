import type { NextConfig } from "next";

const desenvolvimento = process.env.NODE_ENV === "development";

// Política de conteúdo: o site só carrega scripts, estilos, imagens e fontes de si mesmo.
// O Next.js usa scripts e estilos embutidos na página, por isso o 'unsafe-inline'.
// No computador, o modo de desenvolvimento também precisa de 'unsafe-eval' e não usa HTTPS.
const politicaDeConteudo = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${desenvolvimento ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(desenvolvimento ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const cabecalhosDeSeguranca = [
  // As prévias da Vercel carregam a barra de ferramentas da Vercel, que a política bloquearia.
  ...(process.env.VERCEL_ENV === "preview"
    ? []
    : [{ key: "Content-Security-Policy", value: politicaDeConteudo }]),
  // Impede que outro site exiba o FLIM dentro de uma moldura (proteção contra clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: cabecalhosDeSeguranca }];
  },
};

export default nextConfig;
