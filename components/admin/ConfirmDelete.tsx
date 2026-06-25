"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/actions/admin/types";

interface ConfirmDeleteProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  id: string;
  confirmMessage?: string;
  label?: string;
}

/**
 * Delete control that asks for confirmation before submitting and surfaces any
 * server-side error (e.g. a category that still has products) inline.
 */
export function ConfirmDelete({
  action,
  id,
  confirmMessage = "¿Eliminar este elemento? Esta acción no se puede deshacer.",
  label = "Eliminar",
}: ConfirmDeleteProps) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ACTION_STATE,
  );

  return (
    <div className="flex flex-col items-end gap-1">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (!window.confirm(confirmMessage)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-burgundy transition-colors hover:bg-burgundy/10 disabled:opacity-50"
        >
          <Trash2 size={14} aria-hidden="true" />
          {pending ? "Eliminando…" : label}
        </button>
      </form>
      {state.error && (
        <span role="alert" className="max-w-xs text-right text-xs text-burgundy">
          {state.error}
        </span>
      )}
    </div>
  );
}
