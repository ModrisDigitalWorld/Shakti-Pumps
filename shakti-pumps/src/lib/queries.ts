import "server-only";
import { and, asc, count, desc, eq, ilike, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "./db";
import { brands, categories, documents, faqs, industries, products, type Product } from "./db/schema";
import { safe } from "./safe";

export type ProductRow = Product & {
  brandName: string | null;
  brandSlug: string | null;
  categoryName: string | null;
  categorySlug: string | null;
};

const esc = (s: string) => s.replace(/[\\%_]/g, "\\$&");
// "pumps" → "pump", "spares" → "spare" so plural searches still match.
const stem = (t: string) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t);

const productSelect = {
  product: products,
  brandName: brands.name,
  brandSlug: brands.slug,
  categoryName: categories.name,
  categorySlug: categories.slug,
};
const flatten = (r: {
  product: Product;
  brandName: string | null;
  brandSlug: string | null;
  categoryName: string | null;
  categorySlug: string | null;
}): ProductRow => ({ ...r.product, brandName: r.brandName, brandSlug: r.brandSlug, categoryName: r.categoryName, categorySlug: r.categorySlug });

export interface SearchParams {
  q?: string;
  kind?: "product" | "spare";
  category?: string;
  brand?: string;
  application?: string;
  model?: string;
  type?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

export async function searchProducts(p: SearchParams) {
  const pageSize = p.pageSize ?? 24;
  const page = Math.max(1, p.page ?? 1);
  return safe(
    async () => {
      const conds: (SQL | undefined)[] = [eq(products.published, true)];
      if (p.kind) conds.push(eq(products.kind, p.kind));
      if (p.category) conds.push(eq(categories.slug, p.category));
      if (p.brand) conds.push(eq(brands.slug, p.brand));
      if (p.type) conds.push(eq(products.partType, p.type));
      if (p.featured) conds.push(eq(products.featured, true));
      if (p.application) conds.push(sql`${products.applications}::text ILIKE ${"%" + esc(p.application) + "%"}`);
      if (p.model) conds.push(sql`${products.models}::text ILIKE ${"%" + esc(p.model) + "%"}`);
      for (const raw of (p.q ?? "").trim().split(/\s+/).filter(Boolean).slice(0, 6)) {
        const like = `%${esc(stem(raw.toLowerCase()))}%`;
        conds.push(
          or(
            ilike(products.name, like),
            ilike(products.shortDescription, like),
            ilike(products.compatibleEquipment, like),
            ilike(products.partType, like),
            ilike(products.material, like),
            ilike(brands.name, like),
            ilike(categories.name, like),
            sql`${products.models}::text ILIKE ${like}`,
            sql`(CASE WHEN ${products.kind} = 'spare' THEN 'spare part spares' ELSE 'product' END) ILIKE ${like}`,
          ),
        );
      }
      const where = and(...conds);
      const base = () =>
        db()
          .select(productSelect)
          .from(products)
          .leftJoin(brands, eq(products.brandId, brands.id))
          .leftJoin(categories, eq(products.categoryId, categories.id))
          .where(where);
      const rows = await base()
        .orderBy(desc(products.featured), asc(products.sortOrder), asc(products.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
      const [{ total }] = await db()
        .select({ total: count() })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(where);
      return { items: rows.map(flatten), total, page, pageSize };
    },
    { items: [] as ProductRow[], total: 0, page, pageSize },
  );
}

export async function getProductBySlug(slug: string, kind: "product" | "spare") {
  return safe(async () => {
    const [row] = await db()
      .select(productSelect)
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.kind, kind), eq(products.published, true)))
      .limit(1);
    return row ? flatten(row) : null;
  }, null as ProductRow | null);
}

export async function getRelated(item: ProductRow, limit = 4) {
  return safe(async () => {
    const related: (SQL | undefined)[] = [];
    if (item.categoryId) related.push(eq(products.categoryId, item.categoryId));
    if (item.brandId) related.push(eq(products.brandId, item.brandId));
    if (item.partType) related.push(eq(products.partType, item.partType));
    const rows = await db()
      .select(productSelect)
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.published, true),
          eq(products.kind, item.kind),
          ne(products.id, item.id),
          related.length ? or(...related) : undefined,
        ),
      )
      .orderBy(asc(products.sortOrder), asc(products.name))
      .limit(limit);
    return rows.map(flatten);
  }, [] as ProductRow[]);
}

export async function getApplicationOptions(kind?: "product" | "spare") {
  return safe(async () => {
    const r = await db().execute(
      sql`select distinct jsonb_array_elements_text(applications) as a from products where published = true ${
        kind ? sql`and kind = ${kind}` : sql``
      } order by 1`,
    );
    return (r as unknown as { a: string }[]).map((x) => x.a);
  }, [] as string[]);
}

export const getCategories = (selectableOnly = false) =>
  safe(
    () =>
      db()
        .select()
        .from(categories)
        .where(selectableOnly ? eq(categories.selectable, true) : undefined)
        .orderBy(asc(categories.sortOrder), asc(categories.id)),
    [] as (typeof categories.$inferSelect)[],
  );

export const getBrands = () =>
  safe(
    () => db().select().from(brands).where(eq(brands.published, true)).orderBy(asc(brands.sortOrder), asc(brands.name)),
    [] as (typeof brands.$inferSelect)[],
  );

export const getIndustries = () =>
  safe(
    () => db().select().from(industries).where(eq(industries.published, true)).orderBy(asc(industries.sortOrder), asc(industries.id)),
    [] as (typeof industries.$inferSelect)[],
  );

export const getFaqs = () =>
  safe(
    () => db().select().from(faqs).where(eq(faqs.published, true)).orderBy(asc(faqs.sortOrder), asc(faqs.id)),
    [] as (typeof faqs.$inferSelect)[],
  );

export const getDocuments = (limit?: number) =>
  safe(
    async () => {
      const q = db().select().from(documents).where(eq(documents.published, true)).orderBy(asc(documents.sortOrder), desc(documents.id));
      return limit ? q.limit(limit) : q;
    },
    [] as (typeof documents.$inferSelect)[],
  );

export const getBrandBySlug = (slug: string) =>
  safe(async () => (await db().select().from(brands).where(and(eq(brands.slug, slug), eq(brands.published, true))).limit(1))[0] ?? null, null as typeof brands.$inferSelect | null);

export const getSitemapEntries = () =>
  safe(
    () =>
      db()
        .select({ slug: products.slug, kind: products.kind, updatedAt: products.updatedAt })
        .from(products)
        .where(eq(products.published, true)),
    [] as { slug: string; kind: string; updatedAt: Date }[],
  );
