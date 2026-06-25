import type { MetadataRoute } from "next";
import { env } from "@/lib/config/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  return [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/productos`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/contacto`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
