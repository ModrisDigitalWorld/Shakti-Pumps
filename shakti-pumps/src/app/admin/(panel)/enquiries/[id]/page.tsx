import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";
import { EnquiryActions } from "@/components/admin/EnquiryActions";
import { ENQUIRY_TYPE_LABEL, type EnquiryType } from "@/lib/constants";
import { formatDate, telHref, waHref } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [e] = await db().select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
  if (!e) notFound();

  const rows: [string, string][] = [
    ["Type", ENQUIRY_TYPE_LABEL[e.type as EnquiryType] ?? e.type],
    ["Received", formatDate(e.createdAt)],
    ["Name", e.name],
    ["Company", e.company],
    ["Mobile", e.mobile],
    ["Email", e.email],
    ["Product", e.product],
    ["Model / specification", e.model],
    ["Required spare", e.spare],
    ["Quantity", e.quantity],
    ["Source page", e.sourcePage],
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/enquiries" className="text-sm text-brand-700">← All enquiries</Link>
      <h1 className="mt-3 text-2xl font-semibold text-brand-950">Enquiry #{e.id}</h1>

      <div className="card mt-6 p-6">
        <EnquiryActions id={e.id} status={e.status} />
      </div>

      <div className="card mt-5 p-6">
        <dl className="divide-y divide-line text-sm">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 py-3">
              <dt className="font-semibold text-brand-950">{k}</dt>
              <dd className="break-words text-muted">{v}</dd>
            </div>
          ))}
          {e.message && (
            <div className="grid grid-cols-[10rem_1fr] gap-4 py-3">
              <dt className="font-semibold text-brand-950">Message</dt>
              <dd className="whitespace-pre-wrap break-words text-muted">{e.message}</dd>
            </div>
          )}
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={telHref(e.mobile)} className="btn btn-primary btn-sm">Call</a>
          <a href={waHref(e.mobile, `Hello ${e.name}, thank you for your enquiry to Shakti Pumps.`)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm">WhatsApp</a>
          {e.email && <a href={`mailto:${e.email}`} className="btn btn-outline btn-sm">Email</a>}
        </div>
      </div>
    </div>
  );
}
