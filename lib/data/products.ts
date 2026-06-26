import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import type { Category, Product } from "@prisma/client";

export type ProductWithCategory = Product & { category: Category };

export async function getFeaturedProducts(limit = 6): Promise<ProductWithCategory[]> {
  try {
    const prisma = getPrisma();
    return await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
  } catch (error) {
    console.error("[getFeaturedProducts]", error);
    return [];
  }
}

export async function getActiveProducts(
  opts: { categorySlug?: string; search?: string } = {},
): Promise<ProductWithCategory[]> {
  try {
    const prisma = getPrisma();
    return await prisma.product.findMany({
      where: {
        isActive: true,
        ...(opts.categorySlug
          ? { category: { slug: opts.categorySlug } }
          : {}),
        ...(opts.search
          ? {
              OR: [
                { name: { contains: opts.search, mode: "insensitive" } },
                { description: { contains: opts.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("[getActiveProducts]", error);
    return [];
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | null> {
  try {
    const prisma = getPrisma();
    return await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: { category: true },
    });
  } catch (error) {
    console.error("[getProductBySlug]", error);
    return null;
  }
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 3,
): Promise<ProductWithCategory[]> {
  try {
    const prisma = getPrisma();
    return await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        id: { not: excludeProductId },
      },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
  } catch (error) {
    console.error("[getRelatedProducts]", error);
    return [];
  }
}
