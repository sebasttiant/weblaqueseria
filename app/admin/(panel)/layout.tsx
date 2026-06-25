export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth/current-user";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Defense in depth: middleware already gated this route, but the layout
  // re-verifies on the server before rendering any admin content.
  const claims = await requireAdmin();

  return <AdminShell email={claims.email}>{children}</AdminShell>;
}
