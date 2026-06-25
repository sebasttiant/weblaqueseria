export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getAdminCategory } from "@/lib/data/admin/categories";
import { updateCategory } from "@/lib/actions/admin/categories";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await getAdminCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Editar categoría" description={category.name} />
      <CategoryForm
        action={updateCategory}
        category={category}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
