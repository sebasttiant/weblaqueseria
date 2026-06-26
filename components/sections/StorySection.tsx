import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function StorySection() {
  return (
    <section
      className="py-20"
      aria-labelledby="story-heading"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[2rem] border border-brown/10 bg-cream-100 p-3 shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/images/products/masa-madre.svg"
                  alt="Ilustración de pan de masa madre artesanal"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -right-4 -top-5 rounded-2xl bg-charcoal px-5 py-4 text-cream-50 shadow-lg">
              <p className="text-xs uppercase tracking-widest text-cheese">Masa madre</p>
              <p className="mt-1 text-sm">Fermentación lenta y corteza crujiente.</p>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <p className="text-sm font-medium uppercase tracking-widest text-cheese-deep">
              Masa madre
            </p>
            <h2
              id="story-heading"
              className="mt-3 text-3xl font-semibold text-charcoal sm:text-4xl"
            >
              Panes con tiempo, carácter y buena compañía
            </h2>

          <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-brown/80 sm:text-lg">
            <p>
              La Quesería nació de un amor profundo por los quesos artesanales y
              la gastronomía europea. Lo que comenzó como una pequeña selección
              de cuajadas frescas en la Plaza de Mercado de la América se
              convirtió en un rincón gourmet donde los amantes del buen comer
              encuentran lo que buscan.
            </p>
            <p>
              Hoy ofrecemos quesos premium nacionales e importados, jamones y
              charcutería de origen europeo, y nuestros aclamados panes de masa
              madre — elaborados con fermentación natural y cuidado artesanal.
              Cada producto pasa por una selección rigurosa: si no nos
              convencería en nuestra propia mesa, no llega a la tuya.
            </p>
          </div>

          <div className="mt-8 inline-block border-l-4 border-cheese pl-6 text-left">
            <blockquote className="text-lg italic text-charcoal sm:text-xl">
              &ldquo;La mejor comida es la que se hace con tiempo, con paciencia
              y con buenos ingredientes.&rdquo;
            </blockquote>
            <cite className="mt-2 block text-sm text-brown/60 not-italic">
              — La Quesería
            </cite>
          </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
