import Link from "next/link";
import { MapPin, Clock, Instagram } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SITE, whatsappLink } from "@/lib/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-brown/10 bg-charcoal text-cream-100">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className="text-2xl font-semibold text-cream-50"
                style={{ fontFamily: "var(--font-display)" }}
              >
                La Quesería
              </h2>
              <p className="text-sm text-cheese">Quesos &amp; Masa Madre</p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-cream-100/70">
              {SITE.slogan}. Productos artesanales de origen europeo y local,
              seleccionados con cuidado para tu mesa.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cheese">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-cream-100/80">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-cheese" aria-hidden="true" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="shrink-0 text-cheese" aria-hidden="true" />
                <span>{SITE.hours}</span>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${SITE.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-cheese transition-colors"
                  aria-label="Instagram de La Quesería"
                >
                  <Instagram size={16} aria-hidden="true" />
                  <span>@{SITE.instagram}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cheese">
              Hacé tu pedido
            </h3>
            <p className="text-sm text-cream-100/70">
              Escribinos directamente por WhatsApp para hacer tu pedido o
              consultar disponibilidad.
            </p>
            <ButtonLink
              href={whatsappLink("Hola! Quiero hacer un pedido.")}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              className="self-start"
            >
              WhatsApp: {SITE.whatsappDisplay}
            </ButtonLink>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream-100/10 pt-6 sm:flex-row">
          <p className="text-xs text-cream-100/40">
            © {currentYear} La Quesería. Todos los derechos reservados.
          </p>
          <nav className="flex gap-6 text-xs text-cream-100/50" aria-label="Navegación del pie">
            <Link href="/" className="hover:text-cream-100 transition-colors">Inicio</Link>
            <Link href="/productos" className="hover:text-cream-100 transition-colors">Productos</Link>
            <Link href="/contacto" className="hover:text-cream-100 transition-colors">Contacto</Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
