import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { brands, categories } from "@/lib/db/schema";
import { getEntry } from "@/lib/crud";
import { first, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ResourceList({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { resource } = await params;
  const entry = getEntry(resource);
  if (!entry) notFound();
  const { config } = entry;
  const q = first((await searchParams).q)?.toLowerCase().trim();

  const [rowsAll, brandRows, catRows] = await Promise.all([
    db().select().from(entry.table).where(entry.where).orderBy(...entry.orderBy),
    db().select({ id: brands.id, name: brands.name }).from(brands),
    db().select({ id: categories.id, name: categories.name }).from(categories),
  ]);
  const rel = {
    brands: new Map(brandRows.map((b) => [b.id, b.name])),
    categories: new Map(catRows.map((c) => [c.id, c.name])),
  };
  const rows = (rowsAll as Record<string, unknown>[]).filter((r) =>
    q ? JSON.stringify([r.name, r.title, r.question, r.slug, r.partType]).toLowerCase().includes(q) : true,
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-950">{config.label}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">{config.description}</p>
        </div>
        <Link href={`/admin/${resource}/new`} className="btn btn-primary">+ Add {config.singular.toLowerCase()}</Link>
      </div>

      <form className="mt-6" action={`/admin/${resource}`}>
        <input name="q" defaultValue={q} placeholder={`Search ${config.label.toLowerCase()}…`} className="input max-w-sm" />
      </form>

      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
            <tr>{config.columns.map((c) => <th key={c.name} className="px-4 py-3">{c.label}</th>)}<th className="px-4 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={String(r.id)} className="hover:bg-surface">
                {config.columns.map((c, i) => {
                  const v = r[c.name];
                  let cell: React.ReactNode = v == null ? "" : String(v);
                  if (c.type === "bool") cell = v ? <span className="text-green-700">●</span> : <span className="text-slate-300">●</span>;
                  else if (c.type === "image") cell = v ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={String(v)} alt="" className="h-10 w-14 rounded border border-line bg-surface object-contain" /> : <span className="block h-10 w-14 rounded border border-dashed border-line" />;
                  else if (c.type === "relation") cell = rel[c.relation!].get(Number(v)) ?? "—";
                  else if (c.type === "date") cell = formatDate(v as string);
                  return (
                    <td key={c.name} className={`px-4 py-3 ${i === 1 || (i === 0 && c.type !== "image") ? "font-medium text-ink" : "text-muted"}`}>{cell}</td>
                  );
                })}
                <td className="px-4 py-3 text-right"><Link href={`/admin/${resource}/${r.id}`} className="font-semibold text-brand-700 hover:underline">Edit</Link></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-muted">Nothing here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
