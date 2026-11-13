"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

type Kind = "quote" | "spare" | "contact";
type Errors = Record<string, string[] | undefined>;

interface Props {
  kind: Kind;
  productId?: number;
  defaults?: { product?: string; model?: string; spare?: string };
  callHref: string;
  waHref: string;
  submitLabel?: string;
  id?: string;
}

const LABELS: Record<Kind, string> = {
  quote: "Send Enquiry",
  spare: "Send Spare Parts Enquiry",
  contact: "Send Message",
};

function Field({ name, label, required, type = "text", defaultValue, placeholder, inputMode, autoComplete, className, idp, errors }: {
  name: string; label: string; required?: boolean; type?: string; defaultValue?: string; placeholder?: string;
  inputMode?: "tel" | "numeric" | "email"; autoComplete?: string; className?: string; idp: string; errors: Errors;
}) {
  return (
    <div className={className}>
      <label className="label" htmlFor={`${idp}-${name}`}>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <input
        id={`${idp}-${name}`}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="input"
        aria-invalid={errors[name] ? true : undefined}
      />
      {errors[name]?.[0] && <p className="field-error">{errors[name]![0]}</p>}
    </div>
  );
}

export function EnquiryForm({ kind, productId, defaults = {}, callHref, waHref, submitLabel, id }: Props) {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = Object.fromEntries(fd.entries());
    body.type = kind;
    body.sourcePage = pathname;
    if (productId) body.productId = productId;
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.fields ?? {});
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Network problem. Please try again or call us.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div id={id} className="card p-8 text-center" role="status">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12l5 5L20 7" /></svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-brand-950">Thank you — enquiry received</h3>
        <p className="mt-2 text-sm text-muted">Our team will contact you shortly. For urgent requirements, call or WhatsApp us.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={callHref} className="btn btn-primary">Call Now</a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-wa">WhatsApp</a>
        </div>
      </div>
    );
  }

  const idp = id ?? kind;

  return (
    <form id={id} onSubmit={onSubmit} className="card p-5 sm:p-7" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field idp={idp} errors={errors} name="name" label="Name" required autoComplete="name" />
        {kind !== "contact" && <Field idp={idp} errors={errors} name="company" label={kind === "quote" ? "Company name" : "Company"} autoComplete="organization" />}
        <Field idp={idp} errors={errors} name="mobile" label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" />
        {kind !== "spare" && <Field idp={idp} errors={errors} name="email" label="Email" type="email" inputMode="email" autoComplete="email" />}

        {kind === "quote" && (
          <>
            <Field idp={idp} errors={errors} name="product" label="Product required" required defaultValue={defaults.product} />
            <Field idp={idp} errors={errors} name="model" label="Model / specification" defaultValue={defaults.model} />
            <Field idp={idp} errors={errors} name="quantity" label="Quantity" inputMode="numeric" className="sm:col-span-2" />
          </>
        )}
        {kind === "spare" && (
          <>
            <Field idp={idp} errors={errors} name="product" label="Product / model" defaultValue={defaults.product ?? defaults.model} placeholder="Pump / motor / valve make and model" />
            <Field idp={idp} errors={errors} name="spare" label="Required spare" required defaultValue={defaults.spare} />
            <Field idp={idp} errors={errors} name="quantity" label="Quantity" inputMode="numeric" className="sm:col-span-2" />
          </>
        )}

        <div className="sm:col-span-2">
          <label className="label" htmlFor={`${idp}-message`}>
            Message{kind === "contact" && <span className="text-red-600"> *</span>}
          </label>
          <textarea id={`${idp}-message`} name="message" rows={4} required={kind === "contact"} className="input" />
          {errors.message?.[0] && <p className="field-error">{errors.message[0]}</p>}
        </div>

        {/* honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={state === "sending"} className="btn btn-primary flex-1 py-3.5">
          {state === "sending" ? "Sending…" : (submitLabel ?? LABELS[kind])}
        </button>
        <a href={callHref} className="btn btn-outline sm:px-6">Call Now</a>
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-wa sm:px-6">WhatsApp</a>
      </div>
    </form>
  );
}
