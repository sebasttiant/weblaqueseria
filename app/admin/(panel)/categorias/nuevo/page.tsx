export const dynamic = "force-dynamic";

import { createCategory } from "@/lib/actions/admin/categories";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <PageHeader
        title="Nueva categoría"
        description="Agrega una categoría al catálogo."
      />
      <CategoryForm action={createCategory} />
    </div>
  );
}
