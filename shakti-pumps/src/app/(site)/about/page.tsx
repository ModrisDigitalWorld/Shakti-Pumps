import type { Metadata } from "next";
import Link from "next/link";
import { Img } from "@/components/site/Img";
import { PageHero } from "@/components/site/PageHero";
import { categoryHref } from "@/components/site/links";
import { getCategories } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";
import { telHref } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "About Shakti Pumps – Pumps, Motors, Valves & KSB Dealer, Karnal",
  description:
    "Shakti Pumps is a Haryana-based business dealing in pumps, motors, valves, KSB products and industrial spare parts, based in Karnal.",
  path: "/about",
});

export default async function AboutPage() {
  const [s, categories] = await Promise.all([getSettings(), getCategories()]);
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Engineering Products. Practical Support."
      />
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="prose-sp">
            <h2 className="!pt-0">Company introduction</h2>
            <p>
              {s.businessName} is a Haryana-based business dealing in pumps,
              motors, valves, KSB products and industrial spare parts.
            </p>
            <p>
              Our focus is on providing quality-oriented products, reliable
              supply and responsive support according to customer requirements.
            </p>
            <h2>Business focus</h2>
            <p>
              We supply pumps, motors, valves and spare parts for a range of
              water and industrial applications, covering both new equipment and
              maintenance or replacement requirements.
            </p>
            <h2>Product categories</h2>
            <ul>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={categoryHref(c)}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h2>KSB association</h2>
            <p>
              {s.ksbDesignation}. We provide KSB products and related
              requirements, including relevant pumps, valves and spare parts.{" "}
              <Link
                href="/ksb"
                className="font-medium text-brand-700 hover:underline"
              >
                Explore KSB products
              </Link>
              .
            </p>

            <h2>Customer approach</h2>
            <p>
              Customers can discover the product or spare they need, verify the
              details, and enquire directly. We respond to enquiries promptly
              and confirm availability before you commit.
            </p>

            {s.establishedYear && (
              <>
                <h2>Established</h2>
                <p>{s.establishedYear}</p>
              </>
            )}

            <h2>Location &amp; contact</h2>
            <p className="whitespace-pre-line">{s.address}</p>
            <p>
              Phone:{" "}
              <a href={telHref(s.phone)} className="text-brand-700">
                {s.phone}
              </a>{" "}
              · Email:{" "}
              <a href={`mailto:${s.email}`} className="text-brand-700">
                {s.email}
              </a>
            </p>
            <div className="flex flex-wrap gap-3 pt-2 not-prose">
              <Link href="/get-a-quote" className="btn btn-primary">
                Get a Quote
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
          {s.aboutImageUrl && (
            <Img
              src={s.aboutImageUrl}
              alt={`${s.businessName}`}
              ratio="4/5"
              className="h-fit rounded-md"
              sizes="(min-width: 1024px) 35vw, 100vw"
            />
          )}
        </div>
      </section>
    </>
  );
}
