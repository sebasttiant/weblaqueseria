/**
 * Static brand constants. These are fallback defaults; dynamic values may be
 * overridden at runtime through the Setting key-value store.
 */
export const SITE = {
  name: "La Quesería",
  slogan: "Todo comenzó con una Cuajada",
  subtitle: "Quesos & Masa Madre",
  whatsapp: "573137144863",
  whatsappDisplay: "313 714 4863",
  instagram: "laqueseria_plazadelaamerica",
  address: "Plaza de Mercado de la América, Local 126",
  hours: "Lun a Sáb 8:00 - 18:00",
} as const;

/**
 * Build a WhatsApp deep link with an optional pre-filled message.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
