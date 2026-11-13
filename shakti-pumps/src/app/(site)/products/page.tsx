import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { SearchForm } from "@/components/site/SearchForm";
import { getApplicationOptions, getBrands, getCategories, searchProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { first } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = Object.keys(sp).length > 0;
  return pageMeta({
    title: "Pumps, Motors & Valves Supplier in Haryana",
    description: "Browse pumps, motors, valves, KSB products and industrial components from Shakti Pumps, Karnal, Haryana. Request a quote for any product.",
    path: "/products",
    noindex: filtered, // keep filtered/search URLs out of the index; the canonical list stays indexed
  });
}

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const v = {
    q: first(sp.q)?.slice(0, 100),
    category: first(sp.category),
    brand: first(sp.brand),
    model: first(sp.model)?.slice(0, 80),
    application: first(sp.application),
  };
  const page = Math.max(1, Number(first(sp.page)) || 1);
  // A free-text search covers products and spare parts; category/brand browsing stays within the product catalogue.
  const [categories, brands, apps, result] = await Promise.all([
    getCategories(true),
    getBrands(),
    getApplicationOptions("product"),
    searchProducts({ ...v, kind: v.q ? undefined : "product", page }),
  ]);
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const qs = (p: number) => {
    const u = new URLSearchParams();
    for (const [k, val] of Object.entries(v)) if (val) u.set(k, val);
    if (p > 1) u.set("page", String(p));
    return `/products?${u.toString()}`;
  };
  const activeCat = categories.find((c) => c.slug === v.category);

  return (
    <>
      <PageHero eyebrow="Products" title={activeCat ? activeCat.name : "Pumps, Motors, Valves & Industrial Components"}>
        {activeCat?.description || "Products built around your requirement. Search by name, model or application, then request a quote."}
      </PageHero>
      <section className="section !pt-10">
        <div className="container-x">
          <SearchForm action="/products" values={v} categories={categories} brands={brands} applications={apps} />
          <p className="mt-6 text-sm text-muted" aria-live="polite">
            {result.total} {result.total === 1 ? "result" : "results"}
            {v.q && <> for “{v.q}”</>}
          </p>

          {result.items.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="card mt-6 p-10 text-center">
              <h2 className="text-xl font-semibold text-brand-950">No matching products found</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">The item may still be available. Send us the product name or model and we will confirm availability.</p>
              <Link href={`/get-a-quote${v.q ? `?product=${encodeURIComponent(v.q)}` : ""}`} className="btn btn-primary mt-6">Request Availability / Quote</Link>
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4 text-sm">
              {page > 1 && <Link className="btn btn-outline btn-sm" href={qs(page - 1)}>← Previous</Link>}
              <span className="text-muted">Page {page} of {totalPages}</span>
              {page < totalPages && <Link className="btn btn-outline btn-sm" href={qs(page + 1)}>Next →</Link>}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
