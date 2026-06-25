/**
 * Format a Colombian Peso amount for display.
 *
 * Money is stored as an integer minor-unit value. Because COP has no
 * subunit in practice, that integer is the whole-peso value, so this
 * formatter renders it directly with thousands separators (e.g. 28000 -> "$ 28.000").
 */
export function formatPriceCOP(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  const formatted = new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(safe);
  return `$ ${formatted}`;
}

/**
 * Convert an arbitrary string into a URL-safe slug.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
