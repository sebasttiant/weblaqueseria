"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/current-user";
import { SETTING_KEYS } from "@/lib/data/admin/settings";
import type { ActionState } from "@/lib/actions/admin/types";
import { getString } from "@/lib/actions/admin/form-helpers";

export async function updateSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const entries = SETTING_KEYS.map((key) => ({
    key,
    value: getString(formData, key),
  }));

  try {
    const prisma = getPrisma();
    await prisma.$transaction(
      entries.map((entry) =>
        prisma.setting.upsert({
          where: { key: entry.key },
          update: { value: entry.value },
          create: { key: entry.key, value: entry.value },
        }),
      ),
    );
  } catch (error) {
    console.error("[updateSettings]", error);
    return { ok: false, error: "No se pudieron guardar los ajustes" };
  }

  revalidatePath("/admin/ajustes");
  // Public site reads these settings — refresh its cached pages too.
  revalidatePath("/");
  return { ok: true, message: "Ajustes guardados" };
}
