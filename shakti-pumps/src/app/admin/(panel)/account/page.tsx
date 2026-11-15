import { requireAdmin } from "@/lib/auth";
import { AccountForm } from "@/components/admin/AccountForm";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const email = await requireAdmin();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-950">Account</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Change the admin email and password.</p>
      <AccountForm email={email} />
    </div>
  );
}