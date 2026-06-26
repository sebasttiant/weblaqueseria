export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, ArrowLeft, Sparkles, Utensils } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductImage, resolveProductImage } from "@/components/product/ProductImage";
import { StaggeredProducts } from "@/components/motion/StaggeredProducts";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { formatPriceCOP } from "@/lib/utils/format";
import { whatsappLink } from "@/lib/config/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  const description =
    product.description ??
    `${product.name} — ${product.category.name}. Disponible en La Quesería, Plaza de la América.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | La Quesería`,
      description,
      type: "website",
      locale: "es_CO",
      ...(product.imageUrl ? { images: [{ url: product.imageUrl }] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const waMessage = `Hola, me interesa el producto: ${product.name}. ¿Está disponible?`;
  const relatedProducts = await getRelatedProducts(product.categoryId, product.id, 3);
  const cartImageUrl = resolveProductImage(product.imageUrl, product.category.slug);

  return (
    <div className="py-12">
      <Container>
        {/* Back link */}
        <Link
          href="/productos"
          className="mb-8 inline-flex items-center gap-2 text-sm text-brown/70 hover:text-charcoal transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-brown/10 bg-cream-100 shadow-xl">
            <ProductImage
              imageUrl={product.imageUrl}
              categorySlug={product.category.slug}
              alt={product.name}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col gap-6 rounded-[2rem] border border-brown/10 bg-cream-50 p-6 shadow-sm lg:p-8">
            <div>
              <Link
                href={`/productos?categoria=${product.category.slug}`}
                className="inline-flex rounded-full bg-cheese/15 px-4 py-2 text-sm font-medium uppercase tracking-wide text-cheese-deep transition-colors hover:text-brown"
              >
                {product.category.name}
              </Link>
              <h1 className="mt-4 text-4xl font-semibold text-charcoal sm:text-5xl">
                {product.name}
              </h1>
            </div>

            <p className="text-4xl font-semibold text-charcoal">
              {product.priceCents !== null
                ? formatPriceCOP(product.priceCents)
                : "Consultar precio"}
            </p>

            {product.description && (
              <p className="text-base leading-relaxed text-brown/80">
                {product.description}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                name={product.name}
                priceCents={product.priceCents}
                imageUrl={cartImageUrl}
                size="lg"
                className="flex-1"
              />
              <ButtonLink
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Consultar
              </ButtonLink>
            </div>

            {product.sku && (
              <p className="text-xs text-brown/40">SKU: {product.sku}</p>
            )}

            <div className="grid gap-3 rounded-3xl bg-cream-100 p-5 sm:grid-cols-2">
              <div className="flex gap-3">
                <Sparkles size={20} className="mt-1 shrink-0 text-cheese-deep" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-charcoal">Selección recomendada</p>
                  <p className="text-sm text-brown/70">Pregunta por disponibilidad del día y mejores combinaciones.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Utensils size={20} className="mt-1 shrink-0 text-cheese-deep" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-charcoal">Sugerencia de servicio</p>
                  <p className="text-sm text-brown/70">Acompáñalo con masa madre, fruta fresca o charcutería.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20" aria-labelledby="related-heading">
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-cheese-deep">
                  También te puede gustar
                </p>
                <h2 id="related-heading" className="mt-2 text-3xl font-semibold text-charcoal">
                  Más de {product.category.name}
                </h2>
              </div>
              <Link
                href={`/productos?categoria=${product.category.slug}`}
                className="text-sm font-medium text-brown underline-offset-4 hover:underline"
              >
                Ver categoría →
              </Link>
            </div>
            <StaggeredProducts className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </StaggeredProducts>
          </section>
        )}
      </Container>
    </div>
  );
}
