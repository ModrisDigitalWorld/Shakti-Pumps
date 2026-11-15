"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AccountForm({ email }: { email: string }) {
  const router = useRouter();
  const [f, setF] = useState({ currentPassword: "", newEmail: "", newPassword: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (f.newPassword && f.newPassword !== f.confirm) return setMsg({ ok: false, text: "The new passwords do not match." });
    setBusy(true);
    const res = await fetch("/api/admin/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: f.currentPassword, newEmail: f.newEmail, newPassword: f.newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: data.error ?? "Could not save." });
    setMsg({ ok: true, text: "Saved. Use the new details the next time you log in." });
    setF({ currentPassword: "", newEmail: "", newPassword: "", confirm: "" });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card max-w-xl space-y-5 p-6">
      <p className="text-sm text-muted">Signed in as <strong className="text-ink">{email}</strong></p>
      <div>
        <label className="label" htmlFor="newEmail">New email <span className="font-normal text-muted">(leave empty to keep the current one)</span></label>
        <input id="newEmail" type="email" autoComplete="email" className="input" value={f.newEmail} onChange={set("newEmail")} />
      </div>
      <div>
        <label className="label" htmlFor="newPassword">New password <span className="font-normal text-muted">(min. 10 characters, leave empty to keep)</span></label>
        <input id="newPassword" type="password" autoComplete="new-password" className="input" value={f.newPassword} onChange={set("newPassword")} />
      </div>
      <div>
        <label className="label" htmlFor="confirm">Confirm new password</label>
        <input id="confirm" type="password" autoComplete="new-password" className="input" value={f.confirm} onChange={set("confirm")} />
      </div>
      <div className="border-t border-line pt-5">
        <label className="label" htmlFor="currentPassword">Current password <span className="text-red-600">*</span></label>
        <input id="currentPassword" type="password" autoComplete="current-password" required className="input" value={f.currentPassword} onChange={set("currentPassword")} />
      </div>
      {msg && <p className={msg.ok ? "text-sm text-green-700" : "field-error"} role="status">{msg.text}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
    </form>
  );
}