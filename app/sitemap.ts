import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/programacao`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/inscricao`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/edital`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
