import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import type { Category } from "@prisma/client";

export async function getActiveCategories(): Promise<Category[]> {
  try {
    const prisma = getPrisma();
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    console.error("[getActiveCategories]", error);
    return [];
  }
}
