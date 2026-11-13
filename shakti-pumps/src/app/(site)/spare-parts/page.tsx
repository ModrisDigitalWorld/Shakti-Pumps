import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { SearchForm } from "@/components/site/SearchForm";
import { SPARE_TYPES } from "@/lib/constants";
import { getBrands, searchProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { first } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  return pageMeta({
    title: "Pump, Motor & Valve Spare Parts in Karnal, Haryana",
    description:
      "Pump spare parts, motor spare parts, valve spare parts, mechanical seals, bearings, impellers, shafts and couplings — including KSB spare parts — from Shakti Pumps, Karnal.",
    path: "/spare-parts",
    noindex: Object.keys(sp).length > 0,
  });
}

export default async function SparePartsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const v = { q: first(sp.q)?.slice(0, 100), type: first(sp.type), brand: first(sp.brand), model: first(sp.model)?.slice(0, 80) };
  const page = Math.max(1, Number(first(sp.page)) || 1);
  const [brands, result] = await Promise.all([getBrands(), searchProducts({ ...v, kind: "spare", page })]);
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const qs = (p: number) => {
    const u = new URLSearchParams();
    for (const [k, val] of Object.entries(v)) if (val) u.set(k, val);
    if (p > 1) u.set("page", String(p));
    return `/spare-parts?${u.toString()}`;
  };

  return (
    <>
      <PageHero eyebrow="Spare Parts & Components" title="The Right Part. When You Need It.">
        A wide range of pump, motor and valve spare parts for maintenance, replacement and equipment requirements.
      </PageHero>
      <section className="section !pt-10">
        <div className="container-x">
          <SearchForm action="/spare-parts" mode="spare" values={v} brands={brands} compact />

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Spare part types">
            {SPARE_TYPES.map((t) => (
              <li key={t}>
                <Link
                  href={`/spare-parts?type=${encodeURIComponent(t)}`}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${v.type === t ? "border-brand-700 bg-brand-700 text-white" : "border-line text-muted hover:border-brand-500 hover:text-brand-700"}`}
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-muted" aria-live="polite">{result.total} {result.total === 1 ? "spare part" : "spare parts"}</p>

          {result.items.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="card mt-6 p-10 text-center">
              <h2 className="text-xl font-semibold text-brand-950">Can’t find your spare part?</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">Our catalogue is updated regularly. Tell us the equipment make, model and the part you need — it takes less than a minute.</p>
              <Link href={`/get-a-quote?kind=spare${v.q ? `&spare=${encodeURIComponent(v.q)}` : ""}`} className="btn btn-primary mt-6">Send Spare Parts Enquiry</Link>
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
