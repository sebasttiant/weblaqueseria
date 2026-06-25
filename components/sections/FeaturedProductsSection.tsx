import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
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
        <div className="mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-cheese-deep">
              Selección especial
            </p>
            <h2 id="featured-heading" className="mt-2 text-3xl font-semibold text-charcoal sm:text-4xl">
              Productos destacados
            </h2>
          </div>
          <Link
            href="/productos"
            className="text-sm font-medium text-brown underline-offset-4 hover:underline"
          >
            Ver todo el catálogo →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
