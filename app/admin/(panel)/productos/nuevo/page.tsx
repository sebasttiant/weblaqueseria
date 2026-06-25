export const dynamic = "force-dynamic";

import { listCategoryOptions } from "@/lib/data/admin/categories";
import { createProduct } from "@/lib/actions/admin/products";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await listCategoryOptions();

  return (
    <div>
      <PageHeader
        title="Nuevo producto"
        description="Agrega un producto al catálogo."
      />
      {categories.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brown/20 bg-cream-50 p-6 text-sm text-brown/70">
          Primero crea una categoría antes de agregar productos.
        </p>
      ) : (
        <ProductForm action={createProduct} categories={categories} />
      )}
    </div>
  );
}
