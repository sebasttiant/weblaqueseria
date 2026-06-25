export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChefHat, MessageCircle, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { getProductBySlug } from "@/lib/data/products";
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

  const waMessage = `Hola! Me interesa el producto: ${product.name}. ¿Está disponible?`;

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
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-100">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ChefHat size={80} className="text-brown/20" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <Link
                href={`/productos?categoria=${product.category.slug}`}
                className="text-sm font-medium uppercase tracking-wide text-cheese-deep hover:text-brown transition-colors"
              >
                {product.category.name}
              </Link>
              <h1 className="mt-2 text-3xl font-semibold text-charcoal sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <p className="text-3xl font-semibold text-charcoal">
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
                imageUrl={product.imageUrl}
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
          </div>
        </div>
      </Container>
    </div>
  );
}
