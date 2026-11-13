// import type { Metadata } from "next";
// import Link from "next/link";
// import { Img } from "@/components/site/Img";
// import { PageHero } from "@/components/site/PageHero";
// import { getIndustries } from "@/lib/queries";
// import { pageMeta } from "@/lib/seo";

// export const revalidate = 60;

// export const metadata: Metadata = pageMeta({
//   title: "Industries & Applications – Pumps, Valves & Spare Parts",
//   description: "Pumping and fluid-control solutions for water & irrigation, agriculture, industrial, building services, manufacturing and wastewater applications in Haryana.",
//   path: "/industries",
// });

// export default async function IndustriesPage() {
//   const items = await getIndustries();
//   return (
//     <>
//       <PageHero eyebrow="Industries" title="Solutions for Different Applications">
//         Products and components for the water, industrial and commercial applications we serve.
//       </PageHero>
//       <section className="section">
//         <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {items.map((it, i) => (
//             <article key={it.id} id={it.slug} className="card flex flex-col overflow-hidden">
//               {it.imageUrl && <Img src={it.imageUrl} alt={it.name} ratio="16/9" />}
//               <div className="flex flex-1 flex-col p-6">
//                 <span className="text-sm font-semibold text-brand-500">{String(i + 1).padStart(2, "0")}</span>
//                 <h2 className="mt-3 text-lg font-semibold uppercase tracking-wide text-brand-950">{it.name}</h2>
//                 <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{it.description}</p>
//                 <Link href={`/products?application=${encodeURIComponent(it.name)}`} className="mt-5 text-sm font-semibold text-brand-700">Related products →</Link>
//               </div>
//             </article>
//           ))}
//         </div>
//         <div className="container-x mt-12 text-center">
//           <p className="text-muted">Not sure which product suits your application?</p>
//           <Link href="/get-a-quote" className="btn btn-primary mt-4">Tell us your requirement</Link>
//         </div>
//       </section>
//     </>
//   );
// }



import type { Metadata } from "next";
import Link from "next/link";
import { Img } from "@/components/site/Img";
import { PageHero } from "@/components/site/PageHero";
import { getIndustries } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Industries & Applications – Pumps, Valves & Spare Parts",
  description: "Pumping and fluid-control solutions for water & irrigation, agriculture, industrial, building services, manufacturing and wastewater applications in Haryana.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const items = await getIndustries();
  return (
    <>
      <PageHero eyebrow="Industries" title="Solutions for Different Applications">
        Products and components for the water, industrial and commercial applications we serve.
      </PageHero>
      <section className="section bg-neutral-50/40 py-16">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <article 
              key={it.id} 
              id={it.slug} 
              className="card group flex flex-col overflow-hidden rounded-2xl border border-line/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
            >
              {it.imageUrl && (
                <div className="overflow-hidden">
                  <Img 
                    src={it.imageUrl} 
                    alt={it.name} 
                    ratio="16/9" 
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div>
                  <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-sm font-semibold text-brand-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold uppercase tracking-wide text-brand-950 transition-colors group-hover:text-brand-700">
                  {it.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {it.description}
                </p>
                <div className="mt-6 border-t border-line/40 pt-4">
                  <Link 
                    href={`/products?application=${encodeURIComponent(it.name)}`} 
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors group-hover:text-brand-800"
                  >
                    <span>Related products</span>
                    <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      ➔ 
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="container-x mt-12">
          <div className="rounded-2xl border border-line/80 bg-gradient-to-br from-white to-neutral-50 p-8 text-center shadow-xs md:p-10">
            <p className="text-muted">Not sure which product suits your application?</p>
            <Link 
              href="/get-a-quote" 
              className="btn btn-primary mt-4 inline-flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
            >
              Tell us your requirement
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}