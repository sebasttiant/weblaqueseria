export const dynamic = "force-dynamic";

import Link from "next/link";
import { Package, Tags, ShoppingCart } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import {
  getDashboardCounts,
  getRecentOrders,
} from "@/lib/data/admin/dashboard";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, ORDER_STATUS_LABELS } from "@/components/admin/StatusBadge";
import { formatPriceCOP } from "@/lib/utils/format";
import { formatDateTimeCO } from "@/lib/utils/datetime";

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "COMPLETED",
  "CANCELLED",
];

export default async function AdminDashboardPage() {
  const [counts, recentOrders] = await Promise.all([
    getDashboardCounts(),
    getRecentOrders(8),
  ]);

  const statCards = [
    {
      label: "Productos",
      value: counts.products,
      hint: `${counts.activeProducts} activos`,
      href: "/admin/productos",
      icon: Package,
    },
    {
      label: "Categorías",
      value: counts.categories,
      href: "/admin/categorias",
      icon: Tags,
    },
    {
      label: "Pedidos",
      value: counts.orders,
      hint: `${counts.ordersByStatus.PENDING} pendientes`,
      href: "/admin/pedidos",
      icon: ShoppingCart,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen general de la tienda."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="flex items-center gap-4 rounded-xl border border-brown/10 bg-cream-50 p-5 transition-colors hover:border-cheese"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cheese/20 text-cheese-deep">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-2xl font-semibold text-charcoal">
                  {card.value}
                </span>
                <span className="text-sm text-brown/70">{card.label}</span>
                {card.hint && (
                  <span className="text-xs text-brown/50">{card.hint}</span>
                )}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Orders by status */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown/60">
          Pedidos por estado
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STATUS_ORDER.map((status) => (
            <div
              key={status}
              className="rounded-xl border border-brown/10 bg-cream-50 p-4"
            >
              <p className="text-xl font-semibold text-charcoal">
                {counts.ordersByStatus[status]}
              </p>
              <p className="mt-1 text-xs text-brown/60">
                {ORDER_STATUS_LABELS[status]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brown/60">
            Pedidos recientes
          </h2>
          <Link
            href="/admin/pedidos"
            className="text-sm font-medium text-cheese-deep hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-brown/20 bg-cream-50 p-8 text-center text-sm text-brown/60">
            No hay pedidos todavía.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-brown/10 bg-cream-50">
            <table className="w-full text-sm">
              <thead className="border-b border-brown/10 text-left text-xs uppercase tracking-wide text-brown/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Pedido</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-brown/5 last:border-0 hover:bg-cream-100"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="font-medium text-charcoal hover:text-cheese-deep"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-brown/80">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 text-charcoal">
                      {formatPriceCOP(order.totalCents)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-brown/60">
                      {formatDateTimeCO(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
