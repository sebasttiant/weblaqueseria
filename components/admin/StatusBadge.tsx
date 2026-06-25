import type { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/utils/cn";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PREPARING: "En preparación",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-cheese/20 text-cheese-deep",
  CONFIRMED: "bg-olive/20 text-olive",
  PREPARING: "bg-brown/15 text-brown",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-burgundy/15 text-burgundy",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
