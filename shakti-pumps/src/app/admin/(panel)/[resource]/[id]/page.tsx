import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { brands, categories } from "@/lib/db/schema";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { getEntry } from "@/lib/crud";

export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, unknown> = { published: true, selectable: true, sortOrder: 0, availability: "On request", ctaLabel: "View Products" };

export default async function ResourceEdit({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  const entry = getEntry(resource);
  if (!entry) notFound();
  const isNew = id === "new";
  const n = Number(id);
  if (!isNew && !Number.isInteger(n)) notFound();

  let initial: Record<string, unknown> = {};
  if (isNew) {
    initial = Object.fromEntries(entry.config.fields.filter((f) => f.name in DEFAULTS).map((f) => [f.name, DEFAULTS[f.name]]));
  } else {
    const [row] = await db().select().from(entry.table).where(and(eq(entry.table.id, n), entry.where)).limit(1);
    if (!row) notFound();
    initial = row as Record<string, unknown>;
  }

  const needs = new Set(entry.config.fields.filter((f) => f.type === "relation").map((f) => f.relation));
  const [brandRows, catRows] = await Promise.all([
    needs.has("brands") ? db().select({ id: brands.id, name: brands.name }).from(brands).orderBy(asc(brands.name)) : [],
    needs.has("categories") ? db().select({ id: categories.id, name: categories.name }).from(categories).where(eq(categories.selectable, true)).orderBy(asc(categories.sortOrder)) : [],
  ]);

  const publicHref = !isNew && "slug" in initial && (resource === "products" || resource === "spare-parts") ? `/${resource}/${initial.slug}` : null;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/admin/${resource}`} className="text-sm text-brand-700">← {entry.config.label}</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-brand-950">{isNew ? `Add ${entry.config.singular.toLowerCase()}` : `Edit ${entry.config.singular.toLowerCase()}`}</h1>
        {publicHref && <a href={publicHref} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-700">View on site ↗</a>}
      </div>
      <div className="card mt-6 p-6">
        <ResourceForm
          fields={entry.config.fields}
          initial={initial}
          endpoint={isNew ? `/api/admin/${resource}` : `/api/admin/${resource}/${n}`}
          method={isNew ? "POST" : "PUT"}
          redirectTo={`/admin/${resource}`}
          deleteEndpoint={isNew ? undefined : `/api/admin/${resource}/${n}`}
          relations={{
            brands: brandRows.map((b) => ({ value: b.id, label: b.name })),
            categories: catRows.map((c) => ({ value: c.id, label: c.name })),
          }}
        />
      </div>
    </div>
  );
}
