import Image from "next/image";
import Link from "next/link";
import { ChefHat } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Category } from "@prisma/client";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-cream-100 py-20" aria-labelledby="categories-heading">
      <Container>
        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-cheese-deep">
            Nuestras familias
          </p>
          <h2
            id="categories-heading"
            className="mt-2 text-3xl font-semibold text-charcoal sm:text-4xl"
          >
            Explora por categoría
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-brown/10 bg-cream-50 p-6 text-center transition-all hover:border-cheese/40 hover:shadow-md"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-cream-100">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ChefHat
                      size={28}
                      className="text-brown/30"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-charcoal transition-colors group-hover:text-brown">
                {cat.name}
              </span>
              {cat.description && (
                <span className="line-clamp-2 text-xs text-brown/60">
                  {cat.description}
                </span>
              )}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
