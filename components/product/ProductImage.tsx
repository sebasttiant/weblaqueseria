import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * Branded category illustrations used whenever a product has no photo. These
 * are first-party SVG tiles (full warm backgrounds) so cards never render an
 * empty placeholder. Drop real product photos at the same `/images/products/`
 * paths later and they take over automatically.
 */
const CATEGORY_IMAGE: Record<string, string> = {
  quesos: "/images/products/quesos.svg",
  charcuteria: "/images/products/charcuteria.svg",
  "masa-madre": "/images/products/masa-madre.svg",
  artesanales: "/images/products/artesanales.svg",
  "gastronomia-europea": "/images/products/gastronomia-europea.svg",
};

const DEFAULT_IMAGE = "/images/products/quesos.svg";

/** Resolve the best local image: the product photo, else its category tile. */
export function resolveProductImage(
  imageUrl: string | null | undefined,
  categorySlug: string,
): string {
  if (imageUrl && imageUrl.trim().length > 0) return imageUrl;
  return CATEGORY_IMAGE[categorySlug] ?? DEFAULT_IMAGE;
}

interface ProductImageProps {
  imageUrl: string | null | undefined;
  categorySlug: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function ProductImage({
  imageUrl,
  categorySlug,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className,
}: ProductImageProps) {
  const src = resolveProductImage(imageUrl, categorySlug);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-gradient-to-br from-cream-100 via-cream-200 to-cheese/25",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
      />
    </div>
  );
}
