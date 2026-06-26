export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { StaggeredProducts } from "@/components/motion/StaggeredProducts";
import { getActiveProducts } from "@/lib/data/products";
import { getActiveCategories } from "@/lib/data/categories";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Explora nuestra selección de quesos premium, charcutería europea, pan de masa madre y más productos artesanales.",
  openGraph: {
    title: "Productos | La Quesería",
    description:
      "Quesos artesanales, jamones, charcutería y masa madre. Selección gourmet en la Plaza de la América, Medellín.",
    type: "website",
    locale: "es_CO",
  },
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categorySlug = params.categoria;
  const search = params.q?.trim();

  const [products, categories] = await Promise.all([
    getActiveProducts({ categorySlug, search }),
    getActiveCategories(),
  ]);

  return (
    <div className="py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-charcoal sm:text-5xl">
            Nuestros productos
          </h1>
          <p className="mt-3 max-w-xl text-base text-brown/70">
            Quesos, charcutería, masa madre y más — selección artesanal para tu
            mesa.
          </p>
        </div>

        {/* Search */}
        <form method="get" className="mb-8">
          {categorySlug && (
            <input type="hidden" name="categoria" value={categorySlug} />
          )}
          <div className="relative max-w-md">
            <label htmlFor="search-input" className="sr-only">
              Buscar productos
            </label>
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brown/40"
              aria-hidden="true"
            />
            <input
              id="search-input"
              name="q"
              type="search"
              defaultValue={search}
              placeholder="Buscar productos..."
              className="h-11 w-full rounded-full border border-brown/20 bg-cream-50 pl-10 pr-4 text-sm text-charcoal placeholder-brown/40 focus:border-cheese focus:outline-none focus:ring-1 focus:ring-cheese"
            />
          </div>
        </form>

        {/* Category pills */}
        {categories.length > 0 && (
          <div
            className="mb-8 flex flex-wrap gap-2"
            role="navigation"
            aria-label="Filtrar por categoría"
          >
            <Link
              href="/productos"
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                !categorySlug
                  ? "border-charcoal bg-charcoal text-cream-50"
                  : "border-brown/20 text-brown hover:border-charcoal hover:text-charcoal",
              )}
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  categorySlug === cat.slug
                    ? "border-charcoal bg-charcoal text-cream-50"
                    : "border-brown/20 text-brown hover:border-charcoal hover:text-charcoal",
                )}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Results */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-xl font-semibold text-charcoal">
              No encontramos productos
            </p>
            <p className="text-brown/60">
              {search
                ? `No hay resultados para "${search}".`
                : "Esta categoría no tiene productos disponibles en este momento."}
            </p>
            <Link
              href="/productos"
              className="text-sm font-medium text-cheese-deep underline-offset-2 hover:underline"
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-brown/60">
              {products.length}{" "}
              {products.length === 1 ? "producto" : "productos"}
              {search && ` para "${search}"`}
              {categorySlug &&
                categories.find((c) => c.slug === categorySlug) &&
                ` en ${categories.find((c) => c.slug === categorySlug)!.name}`}
            </p>
            <StaggeredProducts className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </StaggeredProducts>
          </>
        )}
      </Container>
    </div>
  );
}
