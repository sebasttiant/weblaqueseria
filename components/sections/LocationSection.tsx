import Image from "next/image";
import { MapPin, Clock, Instagram, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
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
          <Reveal>
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
              comprar y recibe recomendación directa para elegir mejor.
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
          </Reveal>

          <Reveal delay={120}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-[2rem] border border-brown/10 bg-cream-100 p-3 shadow-xl transition-transform hover:-translate-y-1"
              aria-label="Ver La Quesería en Google Maps"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/images/sections/store-sign.png"
                  alt="La Quesería en la Plaza de Mercado de la América"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-cream-50/95 p-4 shadow-lg backdrop-blur-sm">
                  <p className="font-semibold text-charcoal">
                    Plaza de Mercado de la América
                  </p>
                  <p className="text-sm text-brown/70">Local 126 · Medellín</p>
                  <p className="mt-1 text-xs font-medium text-cheese-deep">
                    Clic para abrir en Google Maps
                  </p>
                </div>
              </div>
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
