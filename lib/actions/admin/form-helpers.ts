/**
 * Small typed helpers to read values out of a FormData payload inside server
 * actions. They normalize empty strings to `undefined`/`null` and keep the
 * call sites free of repetitive `typeof` checks.
 */

export function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function getOptionalString(
  formData: FormData,
  key: string,
): string | undefined {
  const value = getString(formData, key);
  return value === "" ? undefined : value;
}

export function getBoolean(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

export function getIntOrNull(formData: FormData, key: string): number | null {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

export function getIntOr(
  formData: FormData,
  key: string,
  fallback: number,
): number {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}
