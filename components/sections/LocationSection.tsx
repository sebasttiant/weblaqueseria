import { MapPin, Clock, Instagram, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/config/site";
import type { SiteSettings } from "@/lib/data/settings";

interface LocationSectionProps {
  settings: SiteSettings;
}

export function LocationSection({ settings }: LocationSectionProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address + ", Medellín, Colombia")}`;

  return (
    <section className="py-20" aria-labelledby="location-heading">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Info */}
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-cheese-deep">
              Encuéntranos
            </p>
            <h2
              id="location-heading"
              className="mt-2 text-3xl font-semibold text-charcoal sm:text-4xl"
            >
              Visítanos en la Plaza
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brown/80">
              Estamos en el corazón de la Plaza de Mercado de la América, uno de
              los mercados más tradicionales de Medellín. Ven a probar antes de
              comprar.
            </p>

            <ul className="mt-8 flex flex-col gap-5">
              <li className="flex items-start gap-3">
                <MapPin
                  size={20}
                  className="mt-0.5 shrink-0 text-cheese-deep"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-charcoal">Dirección</p>
                  <p className="text-brown/80">{settings.address}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm text-cheese-deep underline-offset-2 hover:underline"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock
                  size={20}
                  className="mt-0.5 shrink-0 text-cheese-deep"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-charcoal">Horario</p>
                  <p className="text-brown/80">{settings.hours}</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={whatsappLink("Hola! Quisiera información sobre sus productos.")}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
              >
                <MessageCircle size={18} aria-hidden="true" />
                WhatsApp: {settings.whatsappDisplay}
              </ButtonLink>
              <ButtonLink
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="md"
              >
                <Instagram size={18} aria-hidden="true" />
                Instagram
              </ButtonLink>
            </div>
          </div>

          {/* Map embed placeholder */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-2xl border border-brown/10 shadow-md"
            aria-label="Ver La Quesería en Google Maps"
          >
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-cream-100 transition-colors group-hover:bg-cream-100">
              <MapPin
                size={48}
                className="text-cheese-deep transition-transform group-hover:scale-110"
                aria-hidden="true"
              />
              <div className="text-center">
                <p className="font-semibold text-charcoal">
                  Plaza de Mercado de la América
                </p>
                <p className="text-sm text-brown/60">Local 126 · Medellín</p>
                <p className="mt-1 text-xs text-cheese-deep">
                  Clic para abrir en Google Maps
                </p>
              </div>
            </div>
          </a>
        </div>
      </Container>
    </section>
  );
}
