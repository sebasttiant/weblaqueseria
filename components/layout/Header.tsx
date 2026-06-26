"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
] as const;

// Returns false on server, true on client — avoids hydration mismatch without setState-in-effect
function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Header() {
  const pathname = usePathname();
  const isClient = useIsClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  // The admin area renders its own chrome; never show the public header there.
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brown/10 bg-cream-50/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 leading-tight">
            <span className="relative flex h-11 w-11 overflow-hidden rounded-full bg-cream-100 ring-1 ring-brown/10">
              <Image
                src="/images/brand/la-queseria-emblem.png"
                alt="La Quesería"
                fill
                sizes="44px"
                className="object-contain p-1.5"
                priority
              />
            </span>
            <span className="flex flex-col">
              <span className="font-semibold text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
                La Quesería
              </span>
              <span className="text-xs tracking-wide text-brown/70">
                Quesos &amp; Masa Madre
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-charcoal",
                  pathname === link.href
                    ? "bg-cheese/15 text-charcoal"
                    : "text-charcoal/75",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart indicator + mobile toggle */}
          <div className="flex items-center gap-1">
            <Link
              href="/pedido"
              aria-label={
                isClient && itemCount > 0
                  ? `Ver carrito, ${itemCount} ${itemCount === 1 ? "ítem" : "ítems"}`
                  : "Ver carrito"
              }
              className="relative p-2 text-charcoal transition-colors hover:text-cheese-deep"
            >
              <ShoppingBag size={22} aria-hidden="true" />
              {isClient && itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-cheese text-xs font-bold text-charcoal">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            <button
              className="p-2 text-charcoal md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {menuOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 md:hidden",
            menuOpen ? "max-h-60 pb-4" : "max-h-0",
          )}
        >
          <nav
            className="flex flex-col gap-4 border-t border-brown/10 pt-4"
            aria-label="Navegación móvil"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                 className={cn(
                   "rounded-full px-3 py-2 text-sm font-medium hover:text-charcoal",
                   pathname === link.href
                     ? "bg-cheese/15 text-charcoal"
                     : "text-charcoal/80",
                 )}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
