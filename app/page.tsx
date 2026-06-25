export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { StorySection } from "@/components/sections/StorySection";
import { DifferentiatorsSection } from "@/components/sections/DifferentiatorsSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { getFeaturedProducts } from "@/lib/data/products";
import { getActiveCategories } from "@/lib/data/categories";
import { getSiteSettings } from "@/lib/data/settings";

export default async function HomePage() {
  const [settings, featuredProducts, categories] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(6),
    getActiveCategories(),
  ]);

  return (
    <>
      <HeroSection settings={settings} />

      <Suspense fallback={null}>
        <FeaturedProductsSection products={featuredProducts} />
      </Suspense>

      <Suspense fallback={null}>
        <CategoriesSection categories={categories} />
      </Suspense>

      <StorySection />
      <DifferentiatorsSection />
      <LocationSection settings={settings} />
    </>
  );
}
