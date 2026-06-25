"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateSettings } from "@/lib/actions/admin/settings";
import { INITIAL_ACTION_STATE } from "@/lib/actions/admin/types";
import type { SettingsMap } from "@/lib/data/admin/settings";
import { Field, FormFeedback, fieldInputClass } from "@/components/admin/fields";

interface SettingFieldDef {
  key: keyof SettingsMap;
  label: string;
  hint?: string;
}

const SETTING_FIELDS: SettingFieldDef[] = [
  { key: "whatsapp", label: "WhatsApp (número)", hint: "Solo dígitos con indicativo, ej. 573137144863." },
  { key: "whatsapp_display", label: "WhatsApp (visible)", hint: "Formato legible, ej. 313 714 4863." },
  { key: "instagram", label: "Instagram (usuario)" },
  { key: "address", label: "Dirección" },
  { key: "hero_title", label: "Título principal (hero)" },
  { key: "hero_subtitle", label: "Subtítulo (hero)" },
  { key: "slogan", label: "Eslogan" },
  { key: "hours", label: "Horario" },
];

export function SettingsForm({ settings }: { settings: SettingsMap }) {
  const [state, formAction, pending] = useActionState(
    updateSettings,
    INITIAL_ACTION_STATE,
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <FormFeedback error={state.error} message={state.message} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {SETTING_FIELDS.map((field) => (
          <Field
            key={field.key}
            label={field.label}
            htmlFor={field.key}
            hint={field.hint}
          >
            <input
              id={field.key}
              name={field.key}
              type="text"
              defaultValue={settings[field.key]}
              className={fieldInputClass}
            />
          </Field>
        ))}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full bg-cheese px-5 text-base font-medium text-charcoal transition-colors hover:bg-cheese-deep disabled:opacity-50"
      >
        <Save size={18} aria-hidden="true" />
        {pending ? "Guardando…" : "Guardar ajustes"}
      </button>
    </form>
  );
}
