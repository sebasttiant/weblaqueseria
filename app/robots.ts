import type { MetadataRoute } from "next";
import { env } from "@/lib/config/env";

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
