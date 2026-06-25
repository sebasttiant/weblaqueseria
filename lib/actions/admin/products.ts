"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/current-user";
import { slugify } from "@/lib/utils/format";
import { isUniqueConstraintError, isRestrictViolationError } from "@/lib/db/errors";
import type { ActionState } from "@/lib/actions/admin/types";
import {
  getString,
  getOptionalString,
  getBoolean,
  getIntOrNull,
  getIntOr,
} from "@/lib/actions/admin/form-helpers";

const ADMIN_PRODUCTS_PATH = "/admin/productos";

const productSchema = z.object({
  name: z.string().min(1, { error: "El nombre es requerido" }).max(160),
  slug: z.string().max(160).optional(),
  description: z.string().max(2000).optional(),
  categoryId: z.string().min(1, { error: "Selecciona una categoría" }),
  priceCents: z.number().int().nonnegative().nullable(),
  currency: z.string().min(1).max(8),
  imageUrl: z.string().max(2048).optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number().int(),
  stock: z.number().int().nullable(),
  sku: z.string().max(80).optional(),
});

type ProductInput = z.infer<typeof productSchema>;

function readProductForm(formData: FormData): ProductInput {
  return {
    name: getString(formData, "name"),
    slug: getOptionalString(formData, "slug"),
    description: getOptionalString(formData, "description"),
    categoryId: getString(formData, "categoryId"),
    priceCents: getIntOrNull(formData, "priceCents"),
    currency: getString(formData, "currency") || "COP",
    imageUrl: getOptionalString(formData, "imageUrl"),
    isActive: getBoolean(formData, "isActive"),
    isFeatured: getBoolean(formData, "isFeatured"),
    sortOrder: getIntOr(formData, "sortOrder", 0),
    stock: getIntOrNull(formData, "stock"),
    sku: getOptionalString(formData, "sku"),
  };
}

function resolveSlug(data: ProductInput): string {
  return data.slug ? slugify(data.slug) : slugify(data.name);
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = productSchema.safeParse(readProductForm(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const data = parsed.data;
  const slug = resolveSlug(data);
  if (!slug) {
    return { ok: false, error: "El nombre no genera un identificador válido" };
  }

  try {
    const prisma = getPrisma();
    await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        priceCents: data.priceCents,
        currency: data.currency,
        imageUrl: data.imageUrl ?? null,
        categoryId: data.categoryId,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        stock: data.stock,
        sku: data.sku ?? null,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "Ya existe un producto con ese identificador (slug)" };
    }
    if (isRestrictViolationError(error)) {
      return { ok: false, error: "La categoría seleccionada no existe" };
    }
    console.error("[createProduct]", error);
    return { ok: false, error: "No se pudo guardar el producto" };
  }

  revalidatePath(ADMIN_PRODUCTS_PATH);
  redirect(ADMIN_PRODUCTS_PATH);
}

export async function updateProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = getString(formData, "id");
  if (!id) {
    return { ok: false, error: "Producto no encontrado" };
  }

  const parsed = productSchema.safeParse(readProductForm(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const data = parsed.data;
  const slug = resolveSlug(data);
  if (!slug) {
    return { ok: false, error: "El nombre no genera un identificador válido" };
  }

  try {
    const prisma = getPrisma();
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        priceCents: data.priceCents,
        currency: data.currency,
        imageUrl: data.imageUrl ?? null,
        categoryId: data.categoryId,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        stock: data.stock,
        sku: data.sku ?? null,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "Ya existe un producto con ese identificador (slug)" };
    }
    if (isRestrictViolationError(error)) {
      return { ok: false, error: "La categoría seleccionada no existe" };
    }
    console.error("[updateProduct]", error);
    return { ok: false, error: "No se pudo actualizar el producto" };
  }

  revalidatePath(ADMIN_PRODUCTS_PATH);
  redirect(ADMIN_PRODUCTS_PATH);
}

export async function toggleProductActive(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = getString(formData, "id");
  if (!id) return;

  try {
    const prisma = getPrisma();
    const product = await prisma.product.findUnique({
      where: { id },
      select: { isActive: true },
    });
    if (!product) return;
    await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
  } catch (error) {
    console.error("[toggleProductActive]", error);
    return;
  }

  revalidatePath(ADMIN_PRODUCTS_PATH);
}

export async function deleteProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = getString(formData, "id");
  if (!id) {
    return { ok: false, error: "Producto no encontrado" };
  }

  try {
    const prisma = getPrisma();
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    console.error("[deleteProduct]", error);
    return { ok: false, error: "No se pudo eliminar el producto" };
  }

  revalidatePath(ADMIN_PRODUCTS_PATH);
  return { ok: true, message: "Producto eliminado" };
}
