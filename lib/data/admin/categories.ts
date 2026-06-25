import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import type { Category } from "@prisma/client";

export type AdminCategory = Category & { productCount: number };

export interface CategoryOption {
  id: string;
  name: string;
}

/**
 * List every category (active and inactive) with its product count, used to
 * block deletion of categories that still have products.
 */
export async function listAdminCategories(): Promise<AdminCategory[]> {
  try {
    const prisma = getPrisma();
    const rows = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });
    return rows.map(({ _count, ...category }) => ({
      ...category,
      productCount: _count.products,
    }));
  } catch (error) {
    console.error("[listAdminCategories]", error);
    return [];
  }
}

export async function getAdminCategory(id: string): Promise<Category | null> {
  try {
    const prisma = getPrisma();
    return await prisma.category.findUnique({ where: { id } });
  } catch (error) {
    console.error("[getAdminCategory]", error);
    return null;
  }
}

/**
 * Lightweight list of categories for the product form select.
 */
export async function listCategoryOptions(): Promise<CategoryOption[]> {
  try {
    const prisma = getPrisma();
    return await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    });
  } catch (error) {
    console.error("[listCategoryOptions]", error);
    return [];
  }
}
