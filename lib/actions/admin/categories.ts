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
  getIntOr,
} from "@/lib/actions/admin/form-helpers";

const ADMIN_CATEGORIES_PATH = "/admin/categorias";

const categorySchema = z.object({
  name: z.string().min(1, { error: "El nombre es requerido" }).max(120),
  slug: z.string().max(120).optional(),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().max(2048).optional(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

type CategoryInput = z.infer<typeof categorySchema>;

function readCategoryForm(formData: FormData): CategoryInput {
  return {
    name: getString(formData, "name"),
    slug: getOptionalString(formData, "slug"),
    description: getOptionalString(formData, "description"),
    imageUrl: getOptionalString(formData, "imageUrl"),
    sortOrder: getIntOr(formData, "sortOrder", 0),
    isActive: getBoolean(formData, "isActive"),
  };
}

function resolveSlug(data: CategoryInput): string {
  return data.slug ? slugify(data.slug) : slugify(data.name);
}

export async function createCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse(readCategoryForm(formData));
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
    await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "Ya existe una categoría con ese identificador (slug)" };
    }
    console.error("[createCategory]", error);
    return { ok: false, error: "No se pudo guardar la categoría" };
  }

  revalidatePath(ADMIN_CATEGORIES_PATH);
  redirect(ADMIN_CATEGORIES_PATH);
}

export async function updateCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = getString(formData, "id");
  if (!id) {
    return { ok: false, error: "Categoría no encontrada" };
  }

  const parsed = categorySchema.safeParse(readCategoryForm(formData));
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
    await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "Ya existe una categoría con ese identificador (slug)" };
    }
    console.error("[updateCategory]", error);
    return { ok: false, error: "No se pudo actualizar la categoría" };
  }

  revalidatePath(ADMIN_CATEGORIES_PATH);
  redirect(ADMIN_CATEGORIES_PATH);
}

export async function deleteCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = getString(formData, "id");
  if (!id) {
    return { ok: false, error: "Categoría no encontrada" };
  }

  try {
    const prisma = getPrisma();

    // Guard up front: the relation uses onDelete: Restrict, so deleting a
    // category that still has products would fail at the database level. We
    // check first to return a clear message instead of a raw constraint error.
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0) {
      return {
        ok: false,
        error:
          "No se puede eliminar: la categoría tiene productos asociados. Reasigna o elimina esos productos primero.",
      };
    }

    await prisma.category.delete({ where: { id } });
  } catch (error) {
    if (isRestrictViolationError(error)) {
      return {
        ok: false,
        error:
          "No se puede eliminar: la categoría tiene productos asociados.",
      };
    }
    console.error("[deleteCategory]", error);
    return { ok: false, error: "No se pudo eliminar la categoría" };
  }

  revalidatePath(ADMIN_CATEGORIES_PATH);
  return { ok: true, message: "Categoría eliminada" };
}
