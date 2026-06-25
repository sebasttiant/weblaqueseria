"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { INITIAL_ACTION_STATE } from "@/lib/actions/admin/types";
import { Field, fieldInputClass, FormFeedback } from "@/components/admin/fields";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    login,
    INITIAL_ACTION_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormFeedback error={state.error} />

      <Field label="Correo electrónico" htmlFor="email" required>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldInputClass}
          placeholder="admin@laqueseria.co"
        />
      </Field>

      <Field label="Contraseña" htmlFor="password" required>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldInputClass}
          placeholder="••••••••"
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-cheese px-5 text-base font-medium text-charcoal transition-colors hover:bg-cheese-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cheese-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:opacity-50"
      >
        <LogIn size={18} aria-hidden="true" />
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
