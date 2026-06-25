export const dynamic = "force-dynamic";

import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { listAdminOrders } from "@/lib/data/admin/orders";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, ORDER_STATUS_LABELS } from "@/components/admin/StatusBadge";
import { formatPriceCOP } from "@/lib/utils/format";
import { formatDateTimeCO } from "@/lib/utils/datetime";
import { cn } from "@/lib/utils/cn";

const STATUS_FILTERS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "COMPLETED",
  "CANCELLED",
];

function isOrderStatus(value: string | undefined): value is OrderStatus {
  return (
    value !== undefined &&
    (STATUS_FILTERS as readonly string[]).includes(value)
  );
}

interface PageProps {
  searchParams: Promise<{ estado?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeStatus = isOrderStatus(params.estado) ? params.estado : undefined;
  const orders = await listAdminOrders(activeStatus);

  return (
    <div>
      <PageHeader
        title="Pedidos"
        description="Consulta y actualiza el estado de los pedidos."
      />

      {/* Status filter */}
      <div
        className="mb-6 flex flex-wrap gap-2"
        role="navigation"
        aria-label="Filtrar por estado"
      >
        <Link
          href="/admin/pedidos"
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            !activeStatus
              ? "border-charcoal bg-charcoal text-cream-50"
              : "border-brown/20 text-brown hover:border-charcoal hover:text-charcoal",
          )}
        >
          Todos
        </Link>
        {STATUS_FILTERS.map((status) => (
          <Link
            key={status}
            href={`/admin/pedidos?estado=${status}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              activeStatus === status
                ? "border-charcoal bg-charcoal text-cream-50"
                : "border-brown/20 text-brown hover:border-charcoal hover:text-charcoal",
            )}
          >
            {ORDER_STATUS_LABELS[status]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brown/20 bg-cream-50 p-8 text-center text-sm text-brown/60">
          No hay pedidos{activeStatus ? " con este estado" : ""}.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brown/10 bg-cream-50">
          <table className="w-full min-w-[680px] text-sm">
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
              {orders.map((order) => (
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
                    <span className="block text-xs text-brown/50">
                      {order.customerPhone}
                    </span>
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
  );
}
