import { cn } from "@/lib/utils/cn";

/**
 * Shared input styling for admin forms. These are plain presentational helpers
 * (no client hooks) so they can be used inside both server and client forms.
 */
export const fieldInputClass =
  "h-11 w-full rounded-lg border border-brown/20 bg-white px-3 text-sm text-charcoal placeholder-brown/40 transition-colors focus:border-cheese focus:outline-none focus:ring-1 focus:ring-cheese disabled:cursor-not-allowed disabled:opacity-50";

export const fieldTextareaClass =
  "min-h-24 w-full rounded-lg border border-brown/20 bg-white px-3 py-2 text-sm text-charcoal placeholder-brown/40 transition-colors focus:border-cheese focus:outline-none focus:ring-1 focus:ring-cheese disabled:opacity-50";

export const fieldSelectClass = fieldInputClass;

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  required = false,
  hint,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-charcoal">
        {label}
        {required && <span className="text-burgundy"> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-brown/60">{hint}</p>}
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
}

export function CheckboxField({
  id,
  name,
  label,
  defaultChecked = false,
  hint,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-start gap-2">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-brown/30 text-cheese-deep focus:ring-cheese"
      />
      <div className="flex flex-col">
        <label htmlFor={id} className="text-sm font-medium text-charcoal">
          {label}
        </label>
        {hint && <p className="text-xs text-brown/60">{hint}</p>}
      </div>
    </div>
  );
}

/**
 * Inline feedback banner for form actions.
 */
export function FormFeedback({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  if (error) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-burgundy/30 bg-burgundy/10 px-3 py-2 text-sm text-burgundy"
      >
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p
        role="status"
        className="rounded-lg border border-olive/30 bg-olive/10 px-3 py-2 text-sm text-olive"
      >
        {message}
      </p>
    );
  }
  return null;
}
