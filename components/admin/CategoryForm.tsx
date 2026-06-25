"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { slugify } from "@/lib/utils/format";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/actions/admin/types";
import type { Category } from "@prisma/client";
import {
  Field,
  CheckboxField,
  FormFeedback,
  fieldInputClass,
  fieldTextareaClass,
} from "@/components/admin/fields";

interface CategoryFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  category?: Category;
  submitLabel?: string;
}

export function CategoryForm({
  action,
  category,
  submitLabel = "Guardar categoría",
}: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ACTION_STATE,
  );

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(category?.slug));

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <FormFeedback error={state.error} />

      {category && <input type="hidden" name="id" value={category.id} />}

      <Field label="Nombre" htmlFor="name" required>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
          className={fieldInputClass}
          placeholder="Quesos"
        />
      </Field>

      <Field
        label="Identificador (slug)"
        htmlFor="slug"
        hint="Se genera automáticamente desde el nombre. Editable."
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
          placeholder="quesos"
        />
      </Field>

      <Field label="Descripción" htmlFor="description">
        <textarea
          id="description"
          name="description"
          defaultValue={category?.description ?? ""}
          className={fieldTextareaClass}
          placeholder="Descripción de la categoría…"
        />
      </Field>

      <Field
        label="URL de imagen"
        htmlFor="imageUrl"
        hint="MVP: solo URL de texto."
      >
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={category?.imageUrl ?? ""}
          className={fieldInputClass}
          placeholder="https://…"
        />
      </Field>

      <Field label="Orden" htmlFor="sortOrder" hint="Menor = aparece primero.">
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          step={1}
          defaultValue={category?.sortOrder ?? 0}
          className={fieldInputClass}
        />
      </Field>

      <CheckboxField
        id="isActive"
        name="isActive"
        label="Activa"
        hint="Visible en el sitio público."
        defaultChecked={category?.isActive ?? true}
      />

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
          href="/admin/categorias"
          className="text-sm font-medium text-brown hover:text-charcoal"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
