import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroMotion } from "@/components/motion/HeroMotion";
import { whatsappLink } from "@/lib/config/site";
import type { SiteSettings } from "@/lib/data/settings";

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden bg-charcoal py-24"
      aria-labelledby="hero-heading"
    >
      {/* Decorative grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px",
        }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-cheese/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 left-12 h-80 w-80 rounded-full bg-burgundy/25 blur-3xl" aria-hidden="true" />

      <Container className="relative z-10">
        <HeroMotion>
          <div className="grid gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="max-w-3xl">
              <p data-hero-motion className="text-sm font-medium uppercase tracking-[0.25em] text-cheese">
                {settings.heroSubtitle}
              </p>

              <h1
                data-hero-motion
                id="hero-heading"
                className="mt-5 text-5xl font-semibold text-cream-50 sm:text-6xl lg:text-7xl xl:text-8xl"
              >
                Quesos memorables para una mesa que se disfruta sin prisa
              </h1>

              <p data-hero-motion className="mt-6 max-w-2xl text-lg leading-relaxed text-cream-100/75 sm:text-xl">
                {settings.slogan}. Seleccionamos quesos artesanales, charcutería
                europea y panes de masa madre para elevar tus desayunos, tablas y
                encuentros especiales.
              </p>

              <div data-hero-motion className="mt-7 flex flex-wrap gap-3 text-sm text-cream-100/80">
                <span className="rounded-full border border-cream-100/15 bg-cream-100/10 px-4 py-2 backdrop-blur-sm">
                  Selección premium
                </span>
                <span className="rounded-full border border-cream-100/15 bg-cream-100/10 px-4 py-2 backdrop-blur-sm">
                  Local 126 · Plaza de la América
                </span>
                <span className="rounded-full border border-cream-100/15 bg-cream-100/10 px-4 py-2 backdrop-blur-sm">
                  Pedidos por WhatsApp
                </span>
              </div>

              <div data-hero-motion className="mt-10 flex flex-wrap gap-4">
                <ButtonLink
                  href={whatsappLink(
                    "Hola, quiero hacer un pedido con productos de La Quesería.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  className="shadow-lg shadow-cheese/20"
                >
                  Pedir por WhatsApp
                </ButtonLink>
                <ButtonLink
                  href="/productos"
                  variant="outline"
                  size="lg"
                  className="border-cream-100/20 text-cream-100 hover:bg-cream-100/10"
                >
                  Explorar productos
                </ButtonLink>
              </div>
            </div>

            <div data-hero-motion className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div data-hero-float className="relative overflow-hidden rounded-[2rem] border border-cream-100/10 bg-cream-100/10 p-3 shadow-2xl shadow-ink/40 backdrop-blur-sm">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-cream-100">
                  <Image
                    src="/images/sections/store-sign.png"
                    alt="Fachada de La Quesería en la Plaza de Mercado de la América"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="absolute -left-4 -top-8 w-28 rounded-3xl border border-cream-100/20 bg-cream-50 p-3 shadow-xl sm:w-36">
                <Image
                  src="/images/brand/la-queseria-logo.png"
                  alt="La Quesería"
                  width={180}
                  height={90}
                  className="h-auto w-full"
                />
              </div>

              <div className="absolute -bottom-10 -right-3 hidden w-36 overflow-hidden rounded-3xl border border-cream-100/20 bg-cream-50 shadow-xl sm:block lg:w-44">
                <Image
                  src="/images/products/quesos.svg"
                  alt="Ilustración de quesos artesanales"
                  width={220}
                  height={220}
                  className="h-auto w-full"
                />
              </div>

              <div className="absolute bottom-8 left-5 rounded-2xl border border-cream-100/15 bg-charcoal/85 px-5 py-4 text-cream-50 shadow-xl backdrop-blur-sm">
                <p className="text-sm font-semibold text-cheese">De la cava a tu mesa</p>
                <p className="mt-1 text-xs text-cream-100/70">Selección curada para regalar, compartir o disfrutar.</p>
              </div>
            </div>
          </div>
        </HeroMotion>
      </Container>
    </section>
  );
}
