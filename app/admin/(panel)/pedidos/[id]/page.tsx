export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Store } from "lucide-react";
import { getAdminOrder } from "@/lib/data/admin/orders";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { formatPriceCOP } from "@/lib/utils/format";
import { formatDateTimeCO } from "@/lib/utils/datetime";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getAdminOrder(id);

  if (!order) {
    notFound();
  }

  const isDelivery = order.fulfillment === "DELIVERY";

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brown hover:text-charcoal"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a pedidos
      </Link>

      <PageHeader
        title={`Pedido ${order.orderNumber}`}
        description={formatDateTimeCO(order.createdAt)}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items + totals */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-brown/10 bg-cream-50">
            <table className="w-full text-sm">
              <thead className="border-b border-brown/10 text-left text-xs uppercase tracking-wide text-brown/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium">Cant.</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 text-right font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-brown/5 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 text-brown/80">{item.quantity}</td>
                    <td className="px-4 py-3 text-brown/80">
                      {item.unitPriceCents !== null
                        ? formatPriceCOP(item.unitPriceCents)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-charcoal">
                      {item.lineTotalCents !== null
                        ? formatPriceCOP(item.lineTotalCents)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-brown/10">
                  <td colSpan={3} className="px-4 py-3 text-right font-medium text-brown/70">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-base font-semibold text-charcoal">
                    {formatPriceCOP(order.totalCents)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Side: status + customer */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-brown/10 bg-cream-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brown/60">
                Estado
              </h2>
              <StatusBadge status={order.status} />
            </div>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>

          <div className="rounded-xl border border-brown/10 bg-cream-50 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown/60">
              Cliente
            </h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div>
                <dt className="text-brown/50">Nombre</dt>
                <dd className="text-charcoal">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-brown/50">Teléfono</dt>
                <dd className="text-charcoal">{order.customerPhone}</dd>
              </div>
              {order.customerEmail && (
                <div>
                  <dt className="text-brown/50">Correo</dt>
                  <dd className="text-charcoal">{order.customerEmail}</dd>
                </div>
              )}
              {order.customerNote && (
                <div>
                  <dt className="text-brown/50">Nota</dt>
                  <dd className="text-charcoal">{order.customerNote}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-brown/10 bg-cream-50 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown/60">
              Entrega
            </h2>
            <div className="flex items-start gap-2 text-sm text-charcoal">
              {isDelivery ? (
                <MapPin size={16} className="mt-0.5 shrink-0 text-cheese-deep" aria-hidden="true" />
              ) : (
                <Store size={16} className="mt-0.5 shrink-0 text-cheese-deep" aria-hidden="true" />
              )}
              <div>
                <p className="font-medium">
                  {isDelivery ? "Domicilio" : "Recoge en tienda"}
                </p>
                {isDelivery && order.address && (
                  <p className="text-brown/70">{order.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
