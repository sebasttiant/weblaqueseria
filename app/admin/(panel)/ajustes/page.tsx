export const dynamic = "force-dynamic";

import { getSettingsMap } from "@/lib/data/admin/settings";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettingsMap();

  return (
    <div>
      <PageHeader
        title="Ajustes"
        description="Configura la información de contacto y los textos del sitio."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
