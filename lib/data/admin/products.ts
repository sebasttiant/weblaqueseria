import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import type { Category, Product } from "@prisma/client";

export type AdminProduct = Product & { category: Category };

/**
 * List every product (active and inactive) for the admin catalog table.
 */
export async function listAdminProducts(): Promise<AdminProduct[]> {
  try {
    const prisma = getPrisma();
    return await prisma.product.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("[listAdminProducts]", error);
    return [];
  }
}

export async function getAdminProduct(
  id: string,
): Promise<AdminProduct | null> {
  try {
    const prisma = getPrisma();
    return await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  } catch (error) {
    console.error("[getAdminProduct]", error);
    return null;
  }
}
