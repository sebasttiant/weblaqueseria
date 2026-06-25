"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/current-user";
import type { ActionState } from "@/lib/actions/admin/types";
import { getString } from "@/lib/actions/admin/form-helpers";
import type { OrderStatus } from "@prisma/client";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "COMPLETED",
  "CANCELLED",
] as const;

const updateStatusSchema = z.object({
  id: z.string().min(1, { error: "Pedido no encontrado" }),
  status: z.enum(ORDER_STATUSES),
});

/**
 * Allowed forward transitions. Any status may also move to CANCELLED while it
 * is not already terminal. COMPLETED and CANCELLED are terminal.
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function updateOrderStatus(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateStatusSchema.safeParse({
    id: getString(formData, "id"),
    status: getString(formData, "status"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { id, status } = parsed.data;

  try {
    const prisma = getPrisma();
    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!order) {
      return { ok: false, error: "Pedido no encontrado" };
    }

    if (order.status !== status) {
      const allowed = ALLOWED_TRANSITIONS[order.status];
      if (!allowed.includes(status)) {
        return {
          ok: false,
          error: "Transición de estado no permitida",
        };
      }
      await prisma.order.update({ where: { id }, data: { status } });
    }
  } catch (error) {
    console.error("[updateOrderStatus]", error);
    return { ok: false, error: "No se pudo actualizar el estado del pedido" };
  }

  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/pedidos");
  return { ok: true, message: "Estado actualizado" };
}
