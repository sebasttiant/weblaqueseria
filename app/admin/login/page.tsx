export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionClaims } from "@/lib/auth/current-user";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Ingresar",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const claims = await getSessionClaims();
  if (claims?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1
            className="text-2xl font-semibold text-charcoal"
            style={{ fontFamily: "var(--font-display)" }}
          >
            La Quesería
          </h1>
          <p className="mt-1 text-sm text-brown/70">
            Panel de administración
          </p>
        </div>

        <div className="rounded-2xl border border-brown/10 bg-cream-50 p-6 shadow-sm sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-brown/50">
          Acceso restringido al personal autorizado.
        </p>
      </div>
    </div>
  );
}
