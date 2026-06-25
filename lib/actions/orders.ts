"use server";

import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";
import type { FulfillmentType } from "@prisma/client";

const orderItemSchema = z.object({
  productId: z.string().min(1, { error: "Product ID is required" }),
  quantity: z
    .number()
    .int()
    .positive({ error: "Quantity must be a positive integer" }),
});

const createOrderSchema = z
  .object({
    customerName: z.string().min(1, { error: "El nombre es requerido" }),
    customerPhone: z
      .string()
      .regex(/^[0-9+\s\-().]{7,15}$/, {
        error: "Número de teléfono inválido",
      }),
    customerEmail: z
      .preprocess(
        (v) => (v === "" ? undefined : v),
        z.email({ error: "Correo electrónico inválido" }).optional(),
      ),
    customerNote: z.string().max(500).optional(),
    fulfillment: z.enum(["PICKUP", "DELIVERY"]).default("PICKUP"),
    address: z.string().optional(),
    items: z
      .array(orderItemSchema)
      .min(1, { error: "Debe incluir al menos un producto" }),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment === "DELIVERY" && !data.address?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La dirección es requerida para domicilio",
        path: ["address"],
      });
    }
  });

type CreateOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

export async function createOrder(input: unknown): Promise<CreateOrderResult> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Datos inválidos" };
  }

  const data = parsed.data;

  try {
    const prisma = getPrisma();

    // Re-fetch product prices server-side — never trust client values
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of data.items) {
      if (!productMap.has(item.productId)) {
        return { ok: false, error: "Uno o más productos no están disponibles" };
      }
    }

    const orderItems = data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPriceCents = product.priceCents ?? null;
      const lineTotalCents =
        unitPriceCents !== null ? unitPriceCents * item.quantity : null;
      return {
        productId: product.id,
        productName: product.name,
        unitPriceCents,
        quantity: item.quantity,
        lineTotalCents,
      };
    });

    const subtotalCents = orderItems.reduce(
      (sum, item) => sum + (item.lineTotalCents ?? 0),
      0,
    );

    // Generate order number LQ-YYYYMMDD-NNNN
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const dateStr = `${y}${m}${d}`;

    const startOfDay = new Date(y, now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const todayCount = await prisma.order.count({
      where: { createdAt: { gte: startOfDay, lt: endOfDay } },
    });

    const seq = String(todayCount + 1).padStart(4, "0");
    const orderNumber = `LQ-${dateStr}-${seq}`;

    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail ?? null,
          customerNote: data.customerNote ?? null,
          fulfillment: data.fulfillment as FulfillmentType,
          address: data.address?.trim() || null,
          subtotalCents,
          totalCents: subtotalCents,
          items: {
            create: orderItems,
          },
        },
      });
    });

    return { ok: true, orderNumber };
  } catch (error) {
    console.error("[createOrder]", error);
    return {
      ok: false,
      error: "No se pudo crear el pedido. Por favor intenta de nuevo.",
    };
  }
}
