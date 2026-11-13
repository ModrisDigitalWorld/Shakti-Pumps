"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ENQUIRY_STATUSES } from "@/lib/constants";

export function EnquiryActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  async function update(next: string) {
    setValue(next);
    setBusy(true);
    await fetch(`/api/admin/enquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this enquiry permanently?")) return;
    setBusy(true);
    await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    router.push("/admin/enquiries");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor="status" className="text-sm font-medium">Status</label>
      <select id="status" className="input !w-auto" value={value} disabled={busy} onChange={(e) => update(e.target.value)}>
        {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
      </select>
      <button onClick={remove} disabled={busy} className="btn btn-danger btn-sm ml-auto">Delete</button>
    </div>
  );
}
