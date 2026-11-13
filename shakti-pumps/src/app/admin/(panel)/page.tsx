import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { brands, enquiries, products } from "@/lib/db/schema";
import { ENQUIRY_TYPE_LABEL, type EnquiryType } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const d = db();
  const [[newEnq], [totalEnq], [prod], [spare], [brand], recent] = await Promise.all([
    d.select({ n: count() }).from(enquiries).where(eq(enquiries.status, "new")),
    d.select({ n: count() }).from(enquiries),
    d.select({ n: count() }).from(products).where(eq(products.kind, "product")),
    d.select({ n: count() }).from(products).where(eq(products.kind, "spare")),
    d.select({ n: count() }).from(brands),
    d.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(8),
  ]);
  const stats = [
    { label: "New enquiries", value: newEnq.n, href: "/admin/enquiries?status=new", accent: true },
    { label: "Total enquiries", value: totalEnq.n, href: "/admin/enquiries" },
    { label: "Products", value: prod.n, href: "/admin/products" },
    { label: "Spare parts", value: spare.n, href: "/admin/spare-parts" },
    { label: "Brands", value: brand.n, href: "/admin/brands" },
  ];
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-brand-950">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`card p-5 ${s.accent ? "border-brand-500 bg-brand-50" : ""}`}>
            <p className="text-3xl font-semibold text-brand-950">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="btn btn-primary">+ Add product</Link>
        <Link href="/admin/spare-parts/new" className="btn btn-outline">+ Add spare part</Link>
        <Link href="/admin/resources/new" className="btn btn-outline">+ Upload catalogue</Link>
        <Link href="/admin/settings" className="btn btn-outline">Update contact info</Link>
      </div>

      <section className="card mt-8">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold text-brand-950">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm font-semibold text-brand-700">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${e.id}`} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-3 text-sm hover:bg-surface">
                  <span className="w-36 font-medium text-ink">{e.name}</span>
                  <span className="text-muted">{e.mobile}</span>
                  <span className="min-w-0 flex-1 truncate text-muted">{e.spare || e.product || e.message}</span>
                  <span className="rounded bg-surface px-2 py-0.5 text-xs text-muted">{ENQUIRY_TYPE_LABEL[e.type as EnquiryType] ?? e.type}</span>
                  {e.status === "new" && <span className="rounded bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">New</span>}
                  <span className="text-xs text-muted">{formatDate(e.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
