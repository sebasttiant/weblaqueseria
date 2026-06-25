import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { whatsappLink } from "@/lib/config/site";
import type { SiteSettings } from "@/lib/data/settings";

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-charcoal py-24"
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

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-cheese">
            {settings.heroSubtitle}
          </p>

          <h1
            id="hero-heading"
            className="mt-5 text-5xl font-semibold text-cream-50 sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            {settings.heroTitle}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-100/70 sm:text-xl">
            {settings.slogan}
          </p>

          <p className="mt-3 text-base text-cream-100/50 italic">
            Quesos artesanales, charcutería europea y masa madre — en{" "}
            {settings.address}.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink
              href={whatsappLink(
                `Hola ${settings.heroTitle}! Quiero hacer un pedido.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Escríbenos por WhatsApp
            </ButtonLink>
            <ButtonLink
              href="/productos"
              variant="outline"
              size="lg"
              className="border-cream-100/20 text-cream-100 hover:bg-cream-100/10"
            >
              Ver productos
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
