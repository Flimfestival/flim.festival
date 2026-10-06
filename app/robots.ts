import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // O painel da portaria é só da comissão.
    rules: { userAgent: "*", allow: "/", disallow: "/portaria" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
