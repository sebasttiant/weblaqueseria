import Link from "next/link";
import { formatPriceCOP } from "@/lib/utils/format";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductImage } from "@/components/product/ProductImage";
import type { ProductWithCategory } from "@/lib/data/products";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-brown/10 bg-cream-50 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-cheese/40">
      <Link
        href={`/productos/${product.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-square overflow-hidden"
      >
        <ProductImage
          imageUrl={product.imageUrl}
          categorySlug={product.category.slug}
          alt={product.name}
        />
        <span className="absolute left-3 top-3 rounded-full bg-charcoal/85 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cream-50 backdrop-blur-sm">
          {product.category.name}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link href={`/productos/${product.slug}`}>
          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-charcoal transition-colors group-hover:text-cheese-deep">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-brown/70">
            {product.description}
          </p>
        )}

        <p className="mt-auto pt-3 text-xl font-semibold text-charcoal">
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
          className="mt-1 w-full"
        />
      </div>
    </article>
  );
}
