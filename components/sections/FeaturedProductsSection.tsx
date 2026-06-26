import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { StaggeredProducts } from "@/components/motion/StaggeredProducts";
import type { ProductWithCategory } from "@/lib/data/products";

interface FeaturedProductsSectionProps {
  products: ProductWithCategory[];
}

export function FeaturedProductsSection({
  products,
}: FeaturedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-20" aria-labelledby="featured-heading">
      <Container>
        <Reveal className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-cheese-deep">
              Favoritos de la casa
            </p>
            <h2 id="featured-heading" className="mt-2 text-3xl font-semibold text-charcoal sm:text-4xl">
              Lo que más provoca llevar a la mesa
            </h2>
            <p className="mt-3 max-w-2xl text-brown/70">
              Una selección curada para resolver una tabla elegante, un desayuno
              especial o un detalle gastronómico con sabor artesanal.
            </p>
          </div>
          <Link
            href="/productos"
            className="text-sm font-medium text-brown underline-offset-4 hover:underline"
          >
            Ver todo el catálogo →
          </Link>
        </Reveal>

        <StaggeredProducts className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggeredProducts>
      </Container>
    </section>
  );
}
