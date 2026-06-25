import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import type { Order, OrderStatus } from "@prisma/client";

export interface DashboardCounts {
  products: number;
  activeProducts: number;
  categories: number;
  orders: number;
  ordersByStatus: Record<OrderStatus, number>;
}

const EMPTY_STATUS: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 0,
  PREPARING: 0,
  COMPLETED: 0,
  CANCELLED: 0,
};

/**
 * Aggregate counts for the dashboard stat cards. Returns zeroed counts on any
 * failure so the dashboard renders even before the database is seeded.
 */
export async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const prisma = getPrisma();
    const [products, activeProducts, categories, orders, grouped] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true } }),
        prisma.category.count(),
        prisma.order.count(),
        prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      ]);

    const ordersByStatus: Record<OrderStatus, number> = { ...EMPTY_STATUS };
    for (const group of grouped) {
      ordersByStatus[group.status] = group._count._all;
    }

    return { products, activeProducts, categories, orders, ordersByStatus };
  } catch (error) {
    console.error("[getDashboardCounts]", error);
    return {
      products: 0,
      activeProducts: 0,
      categories: 0,
      orders: 0,
      ordersByStatus: { ...EMPTY_STATUS },
    };
  }
}

export async function getRecentOrders(limit = 8): Promise<Order[]> {
  try {
    const prisma = getPrisma();
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("[getRecentOrders]", error);
    return [];
  }
}
