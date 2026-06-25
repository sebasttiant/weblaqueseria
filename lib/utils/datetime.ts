/**
 * Colombian locale date/time formatters for admin views.
 */
export function formatDateCO(date: Date): string {
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
}

export function formatDateTimeCO(date: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
