"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Field } from "@/lib/admin-config";

type Opt = { value: number; label: string };
type Values = Record<string, unknown>;

interface Props {
  fields: Field[];
  initial: Values;
  endpoint: string;
  method: "POST" | "PUT";
  /** Where to go after saving. Omit to stay on the page. */
  redirectTo?: string;
  deleteEndpoint?: string;
  relations?: { brands?: Opt[]; categories?: Opt[] };
  submitLabel?: string;
}

// ── value <-> form-state conversion ──────────────────────────────────────────
function toForm(fields: Field[], v: Values): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (const f of fields) {
    const x = v[f.name];
    if (f.type === "boolean") out[f.name] = Boolean(x);
    else if (f.type === "lines") out[f.name] = Array.isArray(x) ? (x as string[]).join("\n") : "";
    else if (f.type === "specs") out[f.name] = Array.isArray(x) ? (x as { label: string; value: string }[]).map((s) => `${s.label}: ${s.value}`).join("\n") : "";
    else if (f.type === "relation") out[f.name] = x == null ? "" : String(x);
    else out[f.name] = x == null ? "" : String(x);
  }
  return out;
}

function toPayload(fields: Field[], s: Record<string, string | boolean>) {
  const out: Values = {};
  for (const f of fields) {
    const x = s[f.name];
    switch (f.type) {
      case "boolean": out[f.name] = Boolean(x); break;
      case "number": out[f.name] = Number(x) || 0; break;
      case "relation": out[f.name] = x === "" ? null : Number(x); break;
      case "lines": out[f.name] = String(x).split("\n").map((l) => l.trim()).filter(Boolean); break;
      case "specs":
        out[f.name] = String(x).split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
          const i = l.indexOf(":");
          return i === -1 ? { label: l, value: "" } : { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() };
        });
        break;
      default: out[f.name] = String(x);
    }
  }
  return out;
}

// ── Upload / URL field ───────────────────────────────────────────────────────
function UploadField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isImage = field.type === "image";

  async function upload(file: File) {
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("kind", isImage ? "image" : "file");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload →" />
        <button type="button" className="btn btn-outline shrink-0" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={input}
          type="file"
          hidden
          accept={isImage ? "image/jpeg,image/png,image/webp,image/avif" : ".pdf,.doc,.docx,.xls,.xlsx"}
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </div>
      {value && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-3 h-28 w-auto rounded border border-line bg-surface object-contain" />
      )}
      {value && !isImage && <a href={value} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-brand-700 underline">Open current file ↗</a>}
      {err && <p className="field-error">{err}</p>}
    </div>
  );
}

// ── Form ─────────────────────────────────────────────────────────────────────
export function ResourceForm({ fields, initial, endpoint, method, redirectTo, deleteEndpoint, relations = {}, submitLabel }: Props) {
  const router = useRouter();
  const [state, setState] = useState(() => toForm(fields, initial));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  const set = (name: string, v: string | boolean) => setState((s) => ({ ...s, [name]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setErrors({});
    try {
      const res = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(toPayload(fields, state)) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.fields ?? {});
        setMsg({ ok: false, text: data.error ?? "Could not save." });
        return;
      }
      setMsg({ ok: true, text: "Saved." });
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch {
      setMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!deleteEndpoint || !confirm("Delete this item permanently?")) return;
    setBusy(true);
    const res = await fetch(deleteEndpoint, { method: "DELETE" });
    if (res.ok) {
      router.push(redirectTo ?? "/admin");
      router.refresh();
    } else {
      setBusy(false);
      setMsg({ ok: false, text: "Could not delete." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((f) => {
          const id = `f-${f.name}`;
          return (
            <div key={f.name} className={f.half ? "" : "md:col-span-2"}>
              {f.type === "boolean" ? (
                <label className="flex cursor-pointer items-center gap-3 pt-7 text-sm font-medium">
                  <input type="checkbox" checked={Boolean(state[f.name])} onChange={(e) => set(f.name, e.target.checked)} className="h-4 w-4 accent-[#123f8c]" />
                  {f.label}
                </label>
              ) : (
                <>
                  <label htmlFor={id} className="label">
                    {f.label}
                    {f.required && <span className="text-red-600"> *</span>}
                  </label>
                  {f.type === "textarea" || f.type === "lines" || f.type === "specs" ? (
                    <textarea
                      id={id}
                      className="input font-[inherit]"
                      rows={f.type === "textarea" ? 4 : 5}
                      value={String(state[f.name])}
                      onChange={(e) => set(f.name, e.target.value)}
                      placeholder={f.type === "specs" ? "Rated power: …\nMaterial: …" : f.placeholder}
                    />
                  ) : f.type === "select" ? (
                    <select id={id} className="input" value={String(state[f.name])} onChange={(e) => set(f.name, e.target.value)}>
                      <option value="">—</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "relation" ? (
                    <select id={id} className="input" value={String(state[f.name])} onChange={(e) => set(f.name, e.target.value)}>
                      <option value="">— None —</option>
                      {relations[f.relation!]?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.type === "image" || f.type === "file" ? (
                    <UploadField field={f} value={String(state[f.name])} onChange={(v) => set(f.name, v)} />
                  ) : (
                    <input
                      id={id}
                      className="input"
                      type={f.type === "number" ? "number" : "text"}
                      value={String(state[f.name])}
                      onChange={(e) => set(f.name, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  )}
                </>
              )}
              {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
              {errors[f.name]?.[0] && <p className="field-error">{errors[f.name]![0]}</p>}
            </div>
          );
        })}
      </div>

      {msg && (
        <p role="status" className={`rounded-md px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>{msg.text}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : (submitLabel ?? "Save")}</button>
        {deleteEndpoint && <button type="button" className="btn btn-danger ml-auto" disabled={busy} onClick={onDelete}>Delete</button>}
      </div>
    </form>
  );
}
