import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Award, Leaf, Globe, Sparkles } from "lucide-react";

const DIFFERENTIATORS = [
  {
    icon: Award,
    title: "Calidad premium",
    description:
      "Solo trabajamos con productores y distribuidores que cumplen nuestros estándares de sabor, textura y origen.",
  },
  {
    icon: Leaf,
    title: "Elaboración artesanal",
    description:
      "Nuestros productos de masa madre y quesos frescos se hacen con fermentación lenta y procesos tradicionales.",
  },
  {
    icon: Globe,
    title: "Origen europeo y local",
    description:
      "Combinamos lo mejor de la gastronomía europea — quesos franceses, jamones ibéricos — con lo mejor de Colombia.",
  },
  {
    icon: Sparkles,
    title: "Siempre fresco",
    description:
      "Rotamos el stock regularmente para garantizar que lo que llega a tu mesa sea siempre lo más fresco posible.",
  },
] as const;

export function DifferentiatorsSection() {
  return (
    <section
      className="bg-charcoal py-20"
      aria-labelledby="differentiators-heading"
    >
      <Container>
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-cheese">
            De la cava a tu mesa
          </p>
          <h2
            id="differentiators-heading"
            className="mt-2 text-3xl font-semibold text-cream-50 sm:text-4xl"
          >
            Selección cuidada para comprar con confianza
          </h2>
          <p className="mt-4 text-cream-100/65">
            No se trata de llenar una vitrina: elegimos productos con origen,
            rotación y sabor para que cada pedido llegue listo para disfrutar.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFERENTIATORS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-start gap-4 rounded-2xl border border-cream-100/10 bg-cream-100/5 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cheese/10">
                <Icon
                  size={24}
                  className="text-cheese"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-semibold text-cream-50">{title}</h3>
              <p className="text-sm leading-relaxed text-cream-100/60">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
