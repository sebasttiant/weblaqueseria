"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus, ChefHat, ShoppingBag, CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cart";
import { createOrder } from "@/lib/actions/orders";
import { formatPriceCOP } from "@/lib/utils/format";
import { SITE, whatsappLink } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

interface OrderForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNote: string;
  fulfillment: "PICKUP" | "DELIVERY";
  address: string;
}

const INITIAL_FORM: OrderForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerNote: "",
  fulfillment: "PICKUP",
  address: "",
};

export default function PedidoPage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [form, setForm] = useState<OrderForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null); // orderNumber

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const clear = useCartStore((state) => state.clear);

  const subtotalCents = items.reduce(
    (sum, i) => (i.priceCents !== null ? sum + i.priceCents * i.quantity : sum),
    0,
  );

  const hasUnpricedItems = items.some((i) => i.priceCents === null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await createOrder({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail || undefined,
      customerNote: form.customerNote || undefined,
      fulfillment: form.fulfillment,
      address: form.fulfillment === "DELIVERY" ? form.address : undefined,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    clear();
    setConfirmed(result.orderNumber);

    // Auto-open WhatsApp after a brief moment
    const waText = buildWhatsAppMessage(result.orderNumber, form, items, subtotalCents, hasUnpricedItems);
    setTimeout(() => {
      window.open(
        `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`,
        "_blank",
        "noopener,noreferrer",
      );
    }, 800);
  }

  if (!mounted) {
    return (
      <div className="py-12">
        <Container>
          <div className="h-96 animate-pulse rounded-2xl bg-cream-100" />
        </Container>
      </div>
    );
  }

  if (confirmed) {
    const waText = buildWhatsAppMessage(confirmed, form, [], 0, false);
    return (
      <div className="py-16">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <CheckCircle size={64} className="mx-auto text-olive" aria-hidden="true" />
            <h1 className="mt-6 text-3xl font-semibold text-charcoal">
              ¡Pedido recibido!
            </h1>
            <p className="mt-3 text-brown/70">
              Tu pedido{" "}
              <span className="font-semibold text-charcoal">{confirmed}</span>{" "}
              fue registrado. Nos comunicaremos contigo para confirmar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <ButtonLink
                href={whatsappLink(waText)}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                Confirmar por WhatsApp
              </ButtonLink>
              <ButtonLink href="/productos" variant="outline" size="lg">
                Seguir comprando
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <ShoppingBag size={64} className="mx-auto text-brown/20" aria-hidden="true" />
            <h1 className="mt-6 text-2xl font-semibold text-charcoal">
              Tu carrito está vacío
            </h1>
            <p className="mt-3 text-brown/60">
              Agrega productos desde nuestro catálogo para hacer tu pedido.
            </p>
            <ButtonLink href="/productos" size="lg" className="mt-8">
              Ver productos
            </ButtonLink>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12">
      <Container>
        <h1 className="mb-8 text-3xl font-semibold text-charcoal sm:text-4xl">
          Tu pedido
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Cart items — 3 cols */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 rounded-2xl border border-brown/10 bg-cream-50 p-4"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ChefHat size={24} className="text-brown/20" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="font-semibold text-charcoal leading-snug">
                      {item.name}
                    </p>
                    <p className="text-sm text-brown/60">
                      {item.priceCents !== null
                        ? formatPriceCOP(item.priceCents)
                        : "Precio a consultar"}
                    </p>

                    {/* Qty controls */}
                    <div className="mt-auto flex items-center gap-2">
                      <button
                        onClick={() =>
                          setQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label={`Reducir cantidad de ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-brown/20 text-charcoal hover:bg-cream-100 disabled:opacity-40"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-brown/20 text-charcoal hover:bg-cream-100"
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>

                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Eliminar ${item.name} del carrito`}
                        className="ml-auto text-brown/40 hover:text-burgundy transition-colors"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-charcoal">
                      {item.priceCents !== null
                        ? formatPriceCOP(item.priceCents * item.quantity)
                        : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal summary */}
            <div className="mt-6 rounded-2xl border border-brown/10 bg-cream-50 p-4">
              <div className="flex justify-between text-sm text-brown/70">
                <span>Subtotal</span>
                <span>
                  {subtotalCents > 0 ? formatPriceCOP(subtotalCents) : "—"}
                </span>
              </div>
              {hasUnpricedItems && (
                <p className="mt-2 text-xs text-brown/50">
                  * Algunos productos requieren consulta de precio. Te
                  confirmaremos el total final.
                </p>
              )}
              <div className="mt-3 flex justify-between border-t border-brown/10 pt-3 font-semibold text-charcoal">
                <span>Total estimado</span>
                <span>
                  {subtotalCents > 0 ? formatPriceCOP(subtotalCents) : "A confirmar"}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout form — 2 cols */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <h2 className="text-xl font-semibold text-charcoal">
                Tus datos
              </h2>

              <Field label="Nombre completo" required>
                <input
                  name="customerName"
                  type="text"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Ej: María García"
                  className={inputCls}
                />
              </Field>

              <Field label="Teléfono / WhatsApp" required>
                <input
                  name="customerPhone"
                  type="tel"
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  placeholder="Ej: 313 714 4863"
                  className={inputCls}
                />
              </Field>

              <Field label="Correo electrónico (opcional)">
                <input
                  name="customerEmail"
                  type="email"
                  value={form.customerEmail}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  className={inputCls}
                />
              </Field>

              {/* Fulfillment toggle */}
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-charcoal">
                  ¿Cómo lo retiras?
                </legend>
                <div className="flex gap-2">
                  {(["PICKUP", "DELIVERY"] as const).map((type) => (
                    <label
                      key={type}
                      className={cn(
                        "flex flex-1 cursor-pointer items-center justify-center rounded-xl border py-3 text-sm font-medium transition-colors",
                        form.fulfillment === type
                          ? "border-charcoal bg-charcoal text-cream-50"
                          : "border-brown/20 text-brown hover:border-charcoal",
                      )}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value={type}
                        checked={form.fulfillment === type}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {type === "PICKUP" ? "Recoger en tienda" : "A domicilio"}
                    </label>
                  ))}
                </div>
              </fieldset>

              {form.fulfillment === "DELIVERY" && (
                <Field label="Dirección de entrega" required>
                  <input
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="Calle 123 # 45-67, barrio, ciudad"
                    className={inputCls}
                  />
                </Field>
              )}

              <Field label="Nota para el pedido (opcional)">
                <textarea
                  name="customerNote"
                  value={form.customerNote}
                  onChange={handleChange}
                  rows={3}
                  placeholder="¿Alguna indicación especial?"
                  className={cn(inputCls, "resize-none")}
                />
              </Field>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-burgundy/30 bg-burgundy/5 p-3 text-sm text-burgundy"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={loading || items.length === 0}
                className="w-full"
              >
                {loading ? "Enviando pedido…" : "Confirmar pedido"}
              </Button>

              <p className="text-center text-xs text-brown/50">
                Al confirmar, te enviaremos a WhatsApp para finalizar la compra.
                No se realiza ningún cobro en línea.
              </p>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-brown/20 bg-cream-50 px-4 py-2.5 text-sm text-charcoal placeholder-brown/40 focus:border-cheese focus:outline-none focus:ring-1 focus:ring-cheese";

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-charcoal">
        {label}
        {required && <span className="ml-0.5 text-burgundy" aria-hidden="true"> *</span>}
      </label>
      {children}
    </div>
  );
}

function buildWhatsAppMessage(
  orderNumber: string,
  form: OrderForm,
  items: Array<{ name: string; quantity: number; priceCents: number | null }>,
  subtotalCents: number,
  hasUnpricedItems: boolean,
): string {
  const lines = [
    `Hola! Acabo de hacer el pedido *${orderNumber}* en La Quesería.`,
    "",
    `*Nombre:* ${form.customerName}`,
    `*Teléfono:* ${form.customerPhone}`,
    `*Entrega:* ${form.fulfillment === "PICKUP" ? "Recoger en tienda" : `Domicilio — ${form.address}`}`,
  ];

  if (items.length > 0) {
    lines.push("", "*Productos:*");
    for (const item of items) {
      const price =
        item.priceCents !== null
          ? formatPriceCOP(item.priceCents * item.quantity)
          : "precio a consultar";
      lines.push(`• ${item.name} x${item.quantity} — ${price}`);
    }
    lines.push(
      "",
      subtotalCents > 0 && !hasUnpricedItems
        ? `*Total: ${formatPriceCOP(subtotalCents)}*`
        : "*Total: a confirmar*",
    );
  }

  if (form.customerNote) {
    lines.push("", `*Nota:* ${form.customerNote}`);
  }

  return lines.join("\n");
}
