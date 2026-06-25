import "server-only";

import { getPrisma } from "@/lib/db/prisma";

/**
 * Editable Setting keys. These mirror the rows created by the seed and are the
 * snake_case keys actually stored in the database.
 */
export const SETTING_KEYS = [
  "whatsapp",
  "whatsapp_display",
  "instagram",
  "address",
  "hero_title",
  "hero_subtitle",
  "slogan",
  "hours",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];
export type SettingsMap = Record<SettingKey, string>;

const EMPTY_SETTINGS: SettingsMap = {
  whatsapp: "",
  whatsapp_display: "",
  instagram: "",
  address: "",
  hero_title: "",
  hero_subtitle: "",
  slogan: "",
  hours: "",
};

function isSettingKey(key: string): key is SettingKey {
  return (SETTING_KEYS as readonly string[]).includes(key);
}

/**
 * Read the editable settings as a complete map. Missing rows fall back to an
 * empty string so the form always renders, even pre-seed.
 */
export async function getSettingsMap(): Promise<SettingsMap> {
  try {
    const prisma = getPrisma();
    const rows = await prisma.setting.findMany({
      where: { key: { in: [...SETTING_KEYS] } },
    });
    const map: SettingsMap = { ...EMPTY_SETTINGS };
    for (const row of rows) {
      if (isSettingKey(row.key)) {
        map[row.key] = row.value;
      }
    }
    return map;
  } catch (error) {
    console.error("[getSettingsMap]", error);
    return { ...EMPTY_SETTINGS };
  }
}
