"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { slugify } from "@/lib/utils/format";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/actions/admin/types";
import type { CategoryOption } from "@/lib/data/admin/categories";
import type { AdminProduct } from "@/lib/data/admin/products";
import {
  Field,
  CheckboxField,
  FormFeedback,
  fieldInputClass,
  fieldTextareaClass,
  fieldSelectClass,
} from "@/components/admin/fields";

interface ProductFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  categories: CategoryOption[];
  product?: AdminProduct;
  submitLabel?: string;
}

export function ProductForm({
  action,
  categories,
  product,
  submitLabel = "Guardar producto",
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ACTION_STATE,
  );

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(product?.slug));

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      <FormFeedback error={state.error} />

      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="name" required className="sm:col-span-2">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            className={fieldInputClass}
            placeholder="Queso Campesino Artesanal"
          />
        </Field>

        <Field
          label="Identificador (slug)"
          htmlFor="slug"
          hint="Se genera automáticamente desde el nombre. Editable."
          className="sm:col-span-2"
        >
          <input
            id="slug"
            name="slug"
            type="text"
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setSlugEdited(true);
            }}
            className={fieldInputClass}
            placeholder="queso-campesino-artesanal"
          />
        </Field>

        <Field
          label="Descripción"
          htmlFor="description"
          className="sm:col-span-2"
        >
          <textarea
            id="description"
            name="description"
            defaultValue={product?.description ?? ""}
            className={fieldTextareaClass}
            placeholder="Descripción del producto…"
          />
        </Field>

        <Field label="Categoría" htmlFor="categoryId" required>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? ""}
            className={fieldSelectClass}
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Precio (COP)"
          htmlFor="priceCents"
          hint="En pesos. Dejar vacío si no aplica."
        >
          <input
            id="priceCents"
            name="priceCents"
            type="number"
            min={0}
            step={1}
            defaultValue={product?.priceCents ?? ""}
            className={fieldInputClass}
            placeholder="28000"
          />
        </Field>

        <Field label="Moneda" htmlFor="currency">
          <input
            id="currency"
            name="currency"
            type="text"
            defaultValue={product?.currency ?? "COP"}
            className={fieldInputClass}
          />
        </Field>

        <Field label="Orden" htmlFor="sortOrder" hint="Menor = aparece primero.">
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            step={1}
            defaultValue={product?.sortOrder ?? 0}
            className={fieldInputClass}
          />
        </Field>

        <Field
          label="URL de imagen"
          htmlFor="imageUrl"
          hint="MVP: solo URL de texto. No hay carga de archivos."
          className="sm:col-span-2"
        >
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={product?.imageUrl ?? ""}
            className={fieldInputClass}
            placeholder="https://…"
          />
        </Field>

        <Field label="Stock" htmlFor="stock" hint="Opcional.">
          <input
            id="stock"
            name="stock"
            type="number"
            step={1}
            defaultValue={product?.stock ?? ""}
            className={fieldInputClass}
          />
        </Field>

        <Field label="SKU" htmlFor="sku" hint="Opcional.">
          <input
            id="sku"
            name="sku"
            type="text"
            defaultValue={product?.sku ?? ""}
            className={fieldInputClass}
          />
        </Field>

        <div className="flex flex-col gap-3 sm:col-span-2">
          <CheckboxField
            id="isActive"
            name="isActive"
            label="Activo"
            hint="Visible en el sitio público."
            defaultChecked={product?.isActive ?? true}
          />
          <CheckboxField
            id="isFeatured"
            name="isFeatured"
            label="Destacado"
            hint="Aparece en la sección de destacados."
            defaultChecked={product?.isFeatured ?? false}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-cheese px-5 text-base font-medium text-charcoal transition-colors hover:bg-cheese-deep disabled:opacity-50"
        >
          <Save size={18} aria-hidden="true" />
          {pending ? "Guardando…" : submitLabel}
        </button>
        <Link
          href="/admin/productos"
          className="text-sm font-medium text-brown hover:text-charcoal"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
