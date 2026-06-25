"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/ajustes", label: "Ajustes", icon: Settings },
];

interface AdminShellProps {
  email: string;
  children: React.ReactNode;
}

export function AdminShell({ email, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(item: NavItem): boolean {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <div className="flex min-h-screen bg-cream-100 text-charcoal">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-charcoal text-cream-100 transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-cream-100/10 px-5">
          <Link
            href="/admin"
            className="flex flex-col leading-tight"
            onClick={() => setMobileOpen(false)}
          >
            <span
              className="text-base font-semibold text-cream-50"
              style={{ fontFamily: "var(--font-display)" }}
            >
              La Quesería
            </span>
            <span className="text-xs tracking-wide text-cheese">
              Panel de administración
            </span>
          </Link>
          <button
            type="button"
            className="p-1 text-cream-100/70 hover:text-cream-50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav
          className="flex flex-1 flex-col gap-1 p-3"
          aria-label="Navegación del panel"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-cheese text-charcoal"
                    : "text-cream-100/80 hover:bg-cream-100/10 hover:text-cream-50",
                )}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-cream-100/10 p-3">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-xs text-cream-100/60 transition-colors hover:text-cream-50"
          >
            Ver sitio público
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brown/10 bg-cream-50/95 px-4 backdrop-blur-sm sm:px-6">
          <button
            type="button"
            className="p-2 text-charcoal lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} aria-hidden="true" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-brown/70 sm:inline" title={email}>
              {email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-brown/20 px-3 py-1.5 text-sm font-medium text-charcoal transition-colors hover:bg-cream-100"
              >
                <LogOut size={16} aria-hidden="true" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
