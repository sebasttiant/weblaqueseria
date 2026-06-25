export const dynamic = "force-dynamic";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { listAdminCategories } from "@/lib/data/admin/categories";
import { deleteCategory } from "@/lib/actions/admin/categories";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return (
    <div>
      <PageHeader
        title="Categorías"
        description="Organiza el catálogo en categorías."
        action={{ href: "/admin/categorias/nuevo", label: "Nueva categoría" }}
      />

      {categories.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brown/20 bg-cream-50 p-8 text-center text-sm text-brown/60">
          No hay categorías. Crea la primera con “Nueva categoría”.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brown/10 bg-cream-50">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-brown/10 text-left text-xs uppercase tracking-wide text-brown/50">
              <tr>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Productos</th>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-brown/5 last:border-0 hover:bg-cream-100"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-charcoal">
                      {category.name}
                    </span>
                    <span className="block text-xs text-brown/50">
                      {category.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brown/80">
                    {category.productCount}
                  </td>
                  <td className="px-4 py-3 text-brown/80">
                    {category.sortOrder}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        category.isActive
                          ? "inline-flex items-center rounded-full bg-olive/20 px-2.5 py-0.5 text-xs font-medium text-olive"
                          : "inline-flex items-center rounded-full bg-brown/15 px-2.5 py-0.5 text-xs font-medium text-brown"
                      }
                    >
                      {category.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/categorias/${category.id}`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-charcoal transition-colors hover:bg-cream-100"
                      >
                        <Pencil size={14} aria-hidden="true" />
                        Editar
                      </Link>
                      <ConfirmDelete
                        action={deleteCategory}
                        id={category.id}
                        confirmMessage={`¿Eliminar la categoría "${category.name}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
