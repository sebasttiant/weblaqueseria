export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock, Instagram, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { getSiteSettings } from "@/lib/data/settings";
import { whatsappLink } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Encuéntranos en la Plaza de Mercado de la América, Local 126. Escríbenos por WhatsApp o síguenos en Instagram.",
  openGraph: {
    title: "Contacto | La Quesería",
    description:
      "Visítanos en la Plaza de Mercado de la América. WhatsApp, Instagram y horarios de atención.",
    type: "website",
    locale: "es_CO",
  },
};

export default async function ContactoPage() {
  const settings = await getSiteSettings();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address + ", Medellín, Colombia")}`;

  return (
    <div className="py-12">
      <Container>
        <Reveal className="mb-12 grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
          <p className="text-sm font-medium uppercase tracking-widest text-cheese-deep">
            Estamos aquí
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-charcoal sm:text-5xl">
            Ven por el sabor, escríbenos por la recomendación
          </h1>
          <p className="mt-4 max-w-xl text-base text-brown/70">
            Escríbenos por WhatsApp para consultar disponibilidad o hacer tu
            pedido. También puedes visitarnos directamente en la Plaza y elegir
            con asesoría para tu mesa.
          </p>
          </div>
          <div className="relative hidden aspect-[5/3] overflow-hidden rounded-[2rem] border border-brown/10 bg-cream-100 p-2 shadow-lg lg:block">
            <Image
              src="/images/sections/store-sign.png"
              alt="Fachada de La Quesería"
              fill
              sizes="38vw"
              className="object-cover p-2"
              priority
            />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          {/* Contact info */}
          <div className="flex flex-col gap-8">
            {/* WhatsApp */}
            <div className="rounded-[2rem] border border-cheese/30 bg-cheese/10 p-7 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-charcoal">
                Pedidos y recomendaciones por WhatsApp
              </h2>
              <p className="mb-5 text-brown/75">
                La forma más rápida de hacer tu pedido o consultarnos.
                Respondemos en horario de atención.
              </p>
              <ButtonLink
                href={whatsappLink(
                  "Hola, quiero consultar sobre sus productos.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="w-full sm:w-auto"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {settings.whatsappDisplay}
              </ButtonLink>
            </div>

            {/* Instagram */}
            <div className="rounded-2xl border border-brown/10 bg-cream-50 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-charcoal">
                Instagram
              </h2>
              <p className="mb-4 text-sm text-brown/70">
                Síguenos para ver nuestros productos del día, novedades y
                contenido artesanal.
              </p>
              <ButtonLink
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="md"
              >
                <Instagram size={18} aria-hidden="true" />
                @{settings.instagram}
              </ButtonLink>
            </div>

            {/* Location & Hours */}
            <div className="rounded-2xl border border-brown/10 bg-cream-50 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-charcoal">
                Visítanos
              </h2>
              <ul className="flex flex-col gap-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-cheese-deep"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium text-charcoal">
                      {settings.address}
                    </p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-block text-cheese-deep underline-offset-2 hover:underline"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Clock
                    size={18}
                    className="shrink-0 text-cheese-deep"
                    aria-hidden="true"
                  />
                  <span className="text-brown/80">{settings.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="sticky top-24">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-[2rem] border border-brown/10 bg-cream-100 p-3 shadow-xl"
              aria-label="Ver La Quesería en Google Maps"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/images/sections/store-sign.png"
                  alt="La Quesería en Plaza de Mercado de la América"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-cream-50/95 p-5 text-center shadow-lg backdrop-blur-sm">
                  <p className="text-lg font-semibold text-charcoal">
                    Plaza de Mercado de la América
                  </p>
                  <p className="text-sm text-brown/60">Local 126 · Medellín, Colombia</p>
                  <p className="mt-1 text-xs text-cheese-deep">
                    Clic para abrir en Google Maps
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
