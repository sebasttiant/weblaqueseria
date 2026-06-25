import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import { SITE } from "@/lib/config/site";

export interface SiteSettings {
  whatsapp: string;
  whatsappDisplay: string;
  instagram: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  slogan: string;
  hours: string;
}

const DEFAULTS: SiteSettings = {
  whatsapp: SITE.whatsapp,
  whatsappDisplay: SITE.whatsappDisplay,
  instagram: SITE.instagram,
  address: SITE.address,
  heroTitle: SITE.name,
  heroSubtitle: SITE.subtitle,
  slogan: SITE.slogan,
  hours: SITE.hours,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const prisma = getPrisma();
    const rows = await prisma.setting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      whatsapp: map["whatsapp"] ?? DEFAULTS.whatsapp,
      whatsappDisplay: map["whatsappDisplay"] ?? DEFAULTS.whatsappDisplay,
      instagram: map["instagram"] ?? DEFAULTS.instagram,
      address: map["address"] ?? DEFAULTS.address,
      heroTitle: map["heroTitle"] ?? DEFAULTS.heroTitle,
      heroSubtitle: map["heroSubtitle"] ?? DEFAULTS.heroSubtitle,
      slogan: map["slogan"] ?? DEFAULTS.slogan,
      hours: map["hours"] ?? DEFAULTS.hours,
    };
  } catch {
    return { ...DEFAULTS };
  }
}
