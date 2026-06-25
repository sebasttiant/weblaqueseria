import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import type { Order, OrderItem, OrderStatus } from "@prisma/client";

export type AdminOrderWithItems = Order & { items: OrderItem[] };

/**
 * List orders, optionally filtered by status, newest first.
 */
export async function listAdminOrders(
  status?: OrderStatus,
): Promise<Order[]> {
  try {
    const prisma = getPrisma();
    return await prisma.order.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[listAdminOrders]", error);
    return [];
  }
}

export async function getAdminOrder(
  id: string,
): Promise<AdminOrderWithItems | null> {
  try {
    const prisma = getPrisma();
    return await prisma.order.findUnique({
      where: { id },
      include: { items: { orderBy: { createdAt: "asc" } } },
    });
  } catch (error) {
    console.error("[getAdminOrder]", error);
    return null;
  }
}
