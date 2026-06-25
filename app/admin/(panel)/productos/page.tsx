export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { Pencil, ImageOff } from "lucide-react";
import { listAdminProducts } from "@/lib/data/admin/products";
import {
  toggleProductActive,
  deleteProduct,
} from "@/lib/actions/admin/products";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { formatPriceCOP } from "@/lib/utils/format";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Gestiona el catálogo de la tienda."
        action={{ href: "/admin/productos/nuevo", label: "Nuevo producto" }}
      />

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brown/20 bg-cream-50 p-8 text-center text-sm text-brown/60">
          No hay productos. Crea el primero con “Nuevo producto”.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brown/10 bg-cream-50">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-brown/10 text-left text-xs uppercase tracking-wide text-brown/50">
              <tr>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-brown/5 last:border-0 align-middle hover:bg-cream-100"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream-100 text-brown/40">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt=""
                            width={44}
                            height={44}
                            className="h-11 w-11 object-cover"
                          />
                        ) : (
                          <ImageOff size={18} aria-hidden="true" />
                        )}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium text-charcoal">
                          {product.name}
                        </span>
                        <span className="text-xs text-brown/50">
                          {product.slug}
                          {product.isFeatured && " · Destacado"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-brown/80">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    {product.priceCents !== null
                      ? formatPriceCOP(product.priceCents)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-brown/80">
                    {product.stock !== null ? product.stock : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.isActive
                          ? "inline-flex items-center rounded-full bg-olive/20 px-2.5 py-0.5 text-xs font-medium text-olive"
                          : "inline-flex items-center rounded-full bg-brown/15 px-2.5 py-0.5 text-xs font-medium text-brown"
                      }
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-charcoal transition-colors hover:bg-cream-100"
                      >
                        <Pencil size={14} aria-hidden="true" />
                        Editar
                      </Link>
                      <form action={toggleProductActive}>
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          className="rounded-md px-2 py-1 text-xs font-medium text-brown transition-colors hover:bg-cream-100"
                        >
                          {product.isActive ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                      <ConfirmDelete
                        action={deleteProduct}
                        id={product.id}
                        confirmMessage={`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`}
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
