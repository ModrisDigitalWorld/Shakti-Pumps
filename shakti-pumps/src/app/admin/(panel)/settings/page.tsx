import { ResourceForm } from "@/components/admin/ResourceForm";
import { SETTINGS_FIELDS } from "@/lib/admin-config";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-brand-950">Site settings</h1>
      <p className="mt-1 text-sm text-muted">Contact information, KSB designation and key images. Changes appear on the website within a minute.</p>
      <div className="card mt-6 p-6">
        <ResourceForm fields={SETTINGS_FIELDS} initial={s as unknown as Record<string, unknown>} endpoint="/api/admin/settings" method="PUT" />
      </div>
    </div>
  );
}
