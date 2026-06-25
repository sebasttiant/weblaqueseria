export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getAdminProduct } from "@/lib/data/admin/products";
import { listCategoryOptions } from "@/lib/data/admin/categories";
import { updateProduct } from "@/lib/actions/admin/products";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    listCategoryOptions(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Editar producto"
        description={product.name}
      />
      <ProductForm
        action={updateProduct}
        categories={categories}
        product={product}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
