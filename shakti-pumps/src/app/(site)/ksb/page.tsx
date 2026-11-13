import type { Metadata } from "next";
import Link from "next/link";
import { Img } from "@/components/site/Img";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { getBrandBySlug, searchProducts } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "KSB Dealer in Haryana – KSB Pumps, Valves & Spare Parts",
  description: "KSB pumps, valves and KSB spare parts for customers in Haryana from Shakti Pumps, Karnal. Enquire for any KSB product or spare part.",
  path: "/ksb",
});

export default async function KsbPage() {
  const [s, brand, products, spares] = await Promise.all([
    getSettings(),
    getBrandBySlug("ksb"),
    searchProducts({ brand: "ksb", kind: "product", pageSize: 12 }),
    searchProducts({ brand: "ksb", kind: "spare", pageSize: 12 }),
  ]);

  return (
    <>
      <PageHero eyebrow={s.ksbDesignation} title="KSB Products. Reliable Support.">
        {s.businessName} provides KSB products and related requirements for customers in Haryana, including relevant pumps, valves and spare parts.
      </PageHero>

      <section className="section !pb-10">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div className="prose-sp">
            <h2 className="!pt-0 text-2xl font-semibold text-brand-950">{brand?.name ?? "KSB"} at {s.businessName}</h2>
            <p>{brand?.description || `${s.businessName} supplies KSB products and associated spare parts for water, industrial and commercial applications.`}</p>
            <p>Send us the KSB product, model or part number you need and we will confirm availability and pricing.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/get-a-quote?product=KSB" className="btn btn-primary">Request a KSB Quote</Link>
              <Link href="/get-a-quote?kind=spare&spare=KSB" className="btn btn-outline">KSB Spare Parts Enquiry</Link>
            </div>
          </div>
          {s.ksbImageUrl ? (
            <Img src={s.ksbImageUrl} alt="KSB products" ratio="4/3" className="rounded-md" sizes="(min-width: 1024px) 50vw, 100vw" />
          ) : brand?.logoUrl ? (
            <Img src={brand.logoUrl} alt="KSB" ratio="4/3" fit="contain" className="rounded-md border border-line" />
          ) : null}
        </div>
      </section>

      {products.items.length > 0 && (
        <section className="section-alt section !py-14">
          <div className="container-x">
            <h2 className="text-2xl font-semibold tracking-tight text-brand-950">KSB products</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            {products.total > products.items.length && <Link href="/products?brand=ksb" className="mt-8 inline-block text-sm font-semibold text-brand-700">View all KSB products →</Link>}
          </div>
        </section>
      )}

      {spares.items.length > 0 && (
        <section className="section !py-14">
          <div className="container-x">
            <h2 className="text-2xl font-semibold tracking-tight text-brand-950">KSB spare parts</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{spares.items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            {spares.total > spares.items.length && <Link href="/spare-parts?brand=ksb" className="mt-8 inline-block text-sm font-semibold text-brand-700">View all KSB spare parts →</Link>}
          </div>
        </section>
      )}

      <section className="border-t border-line py-14">
        <div className="container-x text-center">
          <h2 className="text-2xl font-semibold text-brand-950">Looking for a specific KSB product or spare?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Our KSB catalogue is updated as the portfolio grows. If it isn’t listed, ask us — we will confirm availability.</p>
          <Link href="/get-a-quote" className="btn btn-primary mt-6">Request Availability / Quote</Link>
        </div>
      </section>
    </>
  );
}
