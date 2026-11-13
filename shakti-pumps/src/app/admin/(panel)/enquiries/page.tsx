import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";
import { ENQUIRY_STATUSES, ENQUIRY_TYPE_LABEL, type EnquiryType } from "@/lib/constants";
import { first, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const status = first(sp.status);
  const q = first(sp.q)?.trim();
  const like = q ? `%${q.replace(/[\\%_]/g, "\\$&")}%` : null;
  const rows = await db()
    .select()
    .from(enquiries)
    .where(
      and(
        status && (ENQUIRY_STATUSES as readonly string[]).includes(status) ? eq(enquiries.status, status) : undefined,
        like ? or(ilike(enquiries.name, like), ilike(enquiries.mobile, like), ilike(enquiries.company, like), ilike(enquiries.product, like), ilike(enquiries.spare, like)) : undefined,
      ),
    )
    .orderBy(desc(enquiries.createdAt))
    .limit(300);

  const tab = (label: string, v?: string) => (
    <Link
      key={label}
      href={v ? `/admin/enquiries?status=${v}` : "/admin/enquiries"}
      className={`rounded-full border px-4 py-1.5 text-sm ${status === v || (!status && !v) ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-muted"}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-brand-950">Enquiries</h1>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {tab("All")}
        {ENQUIRY_STATUSES.map((s) => tab(s[0].toUpperCase() + s.slice(1), s))}
        <form className="ml-auto flex gap-2" action="/admin/enquiries">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, mobile, product…" className="input !w-64 !py-2" />
          <button className="btn btn-outline btn-sm">Search</button>
        </form>
      </div>

      <div className="card mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Requirement</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((e) => (
              <tr key={e.id} className="hover:bg-surface">
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(e.createdAt)}</td>
                <td className="px-4 py-3 font-medium"><Link href={`/admin/enquiries/${e.id}`} className="text-brand-700 hover:underline">{e.name}</Link>{e.company && <span className="block text-xs font-normal text-muted">{e.company}</span>}</td>
                <td className="px-4 py-3">{e.mobile}</td>
                <td className="px-4 py-3">{ENQUIRY_TYPE_LABEL[e.type as EnquiryType] ?? e.type}</td>
                <td className="max-w-xs truncate px-4 py-3 text-muted">{[e.spare, e.product, e.model].filter(Boolean).join(" · ") || e.message}</td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-xs font-semibold ${e.status === "new" ? "bg-brand-700 text-white" : e.status === "contacted" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>{e.status}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">No enquiries found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
