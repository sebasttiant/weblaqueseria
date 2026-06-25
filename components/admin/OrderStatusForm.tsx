"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/lib/actions/admin/orders";
import { INITIAL_ACTION_STATE } from "@/lib/actions/admin/types";
import { ORDER_STATUS_LABELS } from "@/components/admin/StatusBadge";
import { Field, FormFeedback, fieldSelectClass } from "@/components/admin/fields";

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "COMPLETED",
  "CANCELLED",
];

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusForm({
  orderId,
  currentStatus,
}: OrderStatusFormProps) {
  const [state, formAction, pending] = useActionState(
    updateOrderStatus,
    INITIAL_ACTION_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={orderId} />

      <FormFeedback error={state.error} message={state.message} />

      <Field label="Estado del pedido" htmlFor="status">
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className={fieldSelectClass}
        >
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full bg-cheese px-5 text-base font-medium text-charcoal transition-colors hover:bg-cheese-deep disabled:opacity-50"
      >
        <Check size={18} aria-hidden="true" />
        {pending ? "Actualizando…" : "Actualizar estado"}
      </button>
    </form>
  );
}
