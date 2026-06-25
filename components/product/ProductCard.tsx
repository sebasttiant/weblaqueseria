import Image from "next/image";
import Link from "next/link";
import { ChefHat } from "lucide-react";
import { formatPriceCOP } from "@/lib/utils/format";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { ProductWithCategory } from "@/lib/data/products";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-brown/10 bg-cream-50 shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <Link href={`/productos/${product.slug}`} tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ChefHat size={48} className="text-brown/20" aria-hidden="true" />
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-cheese-deep">
          {product.category.name}
        </p>
        <Link href={`/productos/${product.slug}`}>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-charcoal transition-colors hover:text-brown">
            {product.name}
          </h3>
        </Link>
        <p className="mt-auto pt-2 text-lg font-semibold text-charcoal">
          {product.priceCents !== null
            ? formatPriceCOP(product.priceCents)
            : "Consultar precio"}
        </p>

        <AddToCartButton
          productId={product.id}
          slug={product.slug}
          name={product.name}
          priceCents={product.priceCents}
          imageUrl={product.imageUrl}
          size="sm"
          className="w-full"
        />
      </div>
    </article>
  );
}
