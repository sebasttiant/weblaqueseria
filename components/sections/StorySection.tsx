import { Container } from "@/components/ui/Container";

export function StorySection() {
  return (
    <section
      className="py-20"
      aria-labelledby="story-heading"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-cheese-deep">
            Nuestra historia
          </p>
          <h2
            id="story-heading"
            className="mt-3 text-3xl font-semibold text-charcoal sm:text-4xl"
          >
            Todo comenzó con una Cuajada
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
        </div>
      </Container>
    </section>
  );
}
