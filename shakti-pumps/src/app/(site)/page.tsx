import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { FaqList } from "@/components/site/Faq";
import { Img } from "@/components/site/Img";
import { PumpIllustration } from "@/components/site/Art";
import { ProductCard } from "@/components/site/ProductCard";
import { SearchForm } from "@/components/site/SearchForm";
import { brandHref, categoryHref } from "@/components/site/links";
import { SPARE_TYPES } from "@/lib/constants";
import { HeroSlider } from "@/components/site/HeroSlider";
import {
  getApplicationOptions,
  getBrands,
  getCategories,
  getDocuments,
  getFaqs,
  getIndustries,
  searchProducts,
} from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";
import { telHref, waHref } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  ...pageMeta({
    title:
      "KSB Dealer in Haryana | Pumps, Motors, Valves & Spare Parts – Shakti Pumps, Karnal",
    description:
      "Shakti Pumps, Karnal — KSB dealer in Haryana. Industrial pumps, motors, valves and pump spare parts for water, industrial and commercial applications. Request a quote today.",
    path: "/",
  }),
  title: {
    absolute:
      "KSB Dealer in Haryana | Pumps, Motors, Valves & Spare Parts – Shakti Pumps, Karnal",
  },
};

const WHY = [
  [
    "Product knowledge",
    "Understanding of pumps, motors, valves and related spare parts.",
  ],
  [
    "Product range",
    "Multiple categories covering equipment and replacement requirements.",
  ],
  [
    "Reliable supply",
    "Support for routine, replacement and maintenance requirements.",
  ],
  [
    "Responsive support",
    "Quick assistance for product enquiries and requirements.",
  ],
  [
    "KSB experience",
    "Knowledge of relevant KSB products and associated requirements.",
  ],
];

const RESOURCE_TYPES = [
  "Product catalogues",
  "Brochures",
  "Technical documents",
  "Product datasheets",
  "Installation / maintenance information",
];

export default async function HomePage() {
  const [s, categories, brands, industries, faqs, docs, featured, apps] =
    await Promise.all([
      getSettings(),
      getCategories(),
      getBrands(),
      getIndustries(),
      getFaqs(),
      getDocuments(4),
      searchProducts({ featured: true, pageSize: 6 }),
      getApplicationOptions(),
    ]);
  const call = telHref(s.phone);
  const wa = waHref(s.whatsapp, "Hello, I would like to request a quote.");
  const selectable = categories.filter((c) => c.selectable);

  return (
    <>
      {/* 01 — HERO */}
      {/* <section className="relative  overflow-hidden bg-brand-900 text-white">
        <div
          className="absolute inset-y-0 right-0 hidden w-1/2 bg-brand-950/60 lg:block"
          aria-hidden
        />
        <div className="container-x relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-rise">
            <p className="inline-block border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">
              {s.ksbDesignation}
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              Pumps, Motors, Valves &amp; Spare Parts
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Reliable products and component solutions for water, industrial
              and commercial applications.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn btn-light py-3.5 ">
                Explore Products
              </Link>
              <Link href="/get-a-quote" className="btn btn-ghost-light py-3.5">
                Send an Enquiry
              </Link>
            </div>
          </div>
          <div className="relative">
            {s.heroImageUrl ? (
              <Img
                src={s.heroImageUrl}
                alt={`${s.businessName} — pumps and motors`}
                ratio="4/3"
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="rounded-md"
              />
            ) : (
              <PumpIllustration className="mx-auto w-full max-w-xl" />
            )}
          </div>
        </div>
      </section> */}
      {/* 01 — HERO */}
      {/* <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <div className="hero-bg absolute inset-0 -z-10" aria-hidden />
        <div className="container-x grid items-center gap-10 py-10 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-12">
          <div className="min-w-0">
            <p className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-serif uppercase tracking-[0.18em] text-brand-200">
              <span
                className="pulse-dot h-2 w-2 rounded-full bg-brand-300"
                aria-hidden
              />
              {s.ksbDesignation}
            </p>
            <h1
              className="animate-rise mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.75rem]"
              style={{ animationDelay: "80ms" }}
            >
              Pumps, Motors, Valves
              <span className="block text-brand-300">&amp; Spare Parts</span>
            </h1>
            <p
              className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-white/75"
              style={{ animationDelay: "160ms" }}
            >
              Reliable products and component solutions for water, industrial
              and commercial applications.
            </p>
            <div
              className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <Link href="/products" className="btn btn-light py-3.5 sm:px-7">
                Explore Products
              </Link>
              <Link
                href="/get-a-quote"
                className="btn btn-ghost-light py-3.5 sm:px-7"
              >
                Send an Enquiry
              </Link>
            </div>

            <div className="animate-rise mt-10 max-w-xl" style={{ animationDelay: "320ms" }}>
              <form action="/products" method="get" role="search" className="flex overflow-hidden rounded-md bg-white shadow-lg shadow-black/25">
                <label htmlFor="hero-q" className="sr-only">Search products and spare parts</label>
                <input id="hero-q" name="q" type="search" placeholder="Search product, model or spare part…" className="min-w-0 flex-1 px-4 py-3.5 text-base text-ink outline-none placeholder:text-slate-400" />
                <button type="submit" className="bg-brand-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-600">Search</button>
              </form>
              <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60">
                <li>Popular:</li>
                {["KSB pump spare", "Mechanical seals", "Impellers", "Valves"].map((t) => (
                  <li key={t}>
                    <Link href={`/products?q=${encodeURIComponent(t)}`} className="rounded-full border border-white/20 px-3 py-1 transition-colors hover:border-white/50 hover:text-white">{t}</Link>
                  </li>
                ))}
              </ul>
            </div> 
          </div>

          <div
            className="animate-rise relative ml-auto w-full min-w-0 max-w-[34rem]"
            style={{ animationDelay: "200ms" }}
          >
            <div
              className="absolute -inset-6 -z-10 rounded-full bg-brand-500/20 blur-3xl"
              aria-hidden
            />
            {s.heroImageUrl ? (
              <Img
                src={s.heroImageUrl}
                alt={`${s.businessName} — pumps and motors`}
                ratio="4/3"
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="hero-photo bg-transparent"
              />
            ) : (
              <div className="float-y relative rounded-2xl border border-white/15 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-7">
                <PumpIllustration className="mx-auto w-full max-w-xl" />
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                  <span>Pumps · Motors · Valves</span>
                  <span className="text-brand-300">Karnal, Haryana</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section> */}
      {/* 01 — HERO */}
      <HeroSlider ksbDesignation={s.ksbDesignation} />
      {/* 02 — INTRODUCTION */}
      {/* <section className="border-b border-line">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-16">
          <div>
            <p className="eyebrow">{s.businessName}</p>
            <h2 className="h2">{s.tagline}</h2>
            <p className="lead">
              {s.businessName} deals in pumps, motors, valves, KSB products and
              spare parts, supplying customers across Haryana from Karnal.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line">
            {["Pumps", "Motors", "Valves", "Spare Parts"].map((f) => (
              <div key={f} className="bg-white px-5 py-6">
                <dt className="text-lg font-semibold text-brand-950">{f}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section> */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-white to-neutral-50/50">
        <div className="container-x grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-16">
          <div className="space-y-4">
            <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
              {s.businessName}
            </p>
            <h2 className="h2 text-balance  tracking-tight text-brand-950">
              {s.tagline}
            </h2>
            <p className="lead max-w-xl text-neutral-600 ">
              {s.businessName} deals in pumps, motors, valves, KSB products and
              spare parts, supplying customers across Haryana from Karnal.
            </p>
          </div>

          {/* <dl className="grid grid-cols-2 gap-4">
            {["Pumps", "Motors", "Valves", "Spare Parts"].map((f) => (
              <div
                key={f}
                className="group relative overflow-hidden rounded-xl border border-line bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-brand-500 to-brand-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <dt className="text-lg font-semibold text-brand-950 transition-colors group-hover:text-brand-700">
                  {f}
                </dt>
              </div>
            ))}
          </dl> */}
          <ul className="grid grid-cols-2 gap-4">
            {[
              { name: "Pumps", href: "/products?category=pumps" },
              { name: "Motors", href: "/products?category=motors" },
              { name: "Valves", href: "/products?category=valves" },
              { name: "Spare Parts", href: "/spare-parts" },
            ].map((f) => (
              <li key={f.name}>
                <Link
                  href={f.href}
                  className="group relative flex h-full items-center justify-between gap-3 overflow-hidden rounded-xl border border-line bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                >
                  <span
                    className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-500 to-brand-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="text-lg font-semibold text-brand-950 transition-colors group-hover:text-brand-700">
                    {f.name}
                  </span>
                  <span
                    className="text-brand-500 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  >
                    ➜
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — PRODUCT CATEGORIES */}
      <section className="section" id="products">
        <div className="container-x">
          <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
            Our Products
          </p>
          <h2 className="h2 max-w-2xl">
            Products Built Around Your Requirement
          </h2>
          {/* <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Link key={c.id} href={categoryHref(c)} className="card group flex flex-col overflow-hidden p-0">
                {c.imageUrl && <Img src={c.imageUrl} alt={c.name} ratio="16/9" />}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-sm font-semibold text-brand-500">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-lg font-semibold uppercase tracking-wide text-brand-950">{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.description}</p>
                  <span className="mt-5 pt-1 text-sm font-semibold text-brand-700 transition-transform group-hover:translate-x-1">{c.ctaLabel} →</span>
                </div>
              </Link>
            ))}
          </div> */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={categoryHref(c)}
                className="card group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-200 p-0"
              >
                {c.imageUrl && (
                  <div className="relative overflow-hidden bg-slate-100">
                    <Img
                      src={c.imageUrl}
                      alt={c.name}
                      ratio="16/9"
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600 ring-1 ring-inset ring-brand-500/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold uppercase tracking-wide text-slate-900 group-hover:text-brand-600 transition-colors duration-200">
                    {c.name}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600 flex-1">
                    {c.description}
                  </p>

                  <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                    <span>{c.ctaLabel}</span>
                    <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1.5">
                      ➜
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — KSB */}
      <section className="bg-brand-950 text-white" id="ksb">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              KSB Products &amp; Solutions
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              KSB Products. Reliable Support.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {s.businessName} provides KSB products and related requirements
              for customers in Haryana, including relevant pumps, valves and
              spare parts.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-brand-300">
              {s.ksbDesignation}
            </p>
            <Link href="/ksb" className="btn btn-light mt-8">
              Explore KSB Products
            </Link>
          </div>
          <div>
            {s.ksbImageUrl ? (
              <Img
                src={s.ksbImageUrl}
                alt="KSB products"
                ratio="4/3"
                className="rounded-md"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : (
              // <div className="grid aspect-[4/3] place-items-center rounded-md border border-white/15 bg-white/5 p-8 text-center">
              //   <div>
              //     <p className="text-5xl font-bold tracking-[0.2em]">KSB</p>
              //     <p className="mt-3 text-sm uppercase tracking-widest text-white/60">
              //       Pumps · Valves · Spare parts
              //     </p>
              //   </div>
              // </div>
              <div className="grid aspect-[4/3] place-items-center rounded-md border border-white/15 bg-white/5 p-8 text-center">
                <div>
                  <img
                    src="/KSB-Logo.png"
                    alt="KSB Logo"
                    className="mx-auto h-12 w-auto object-contain"
                  />
                  <p className="mt-3 text-sm uppercase tracking-widest text-white/60">
                    Pumps · Valves · Spare parts
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 05 — SPARE PARTS */}
      {/* <section className="section" id="spares">
        <div className="container-x">
          <p className="eyebrow">Spare Parts &amp; Components</p>
          <h2 className="h2">The Right Part. When You Need It.</h2>
          <p className="lead">
            A wide range of pump, motor and valve spare parts for maintenance,
            replacement and equipment requirements.
          </p>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {SPARE_TYPES.map((t) => (
              <li key={t} className="bg-white">
                <Link
                  href={`/spare-parts?type=${encodeURIComponent(t)}`}
                  className="flex items-center justify-between px-6 py-5 text-base font-medium text-brand-950 transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {t}
                  <span aria-hidden className="text-brand-500">
                    ➜
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/spare-parts" className="btn btn-primary mt-8">
            Find Your Spare Part
          </Link>
        </div>
      </section> */}
      <section
        className="section bg-gradient-to-b from-neutral-50/50 to-white py-16"
        id="spares"
      >
        <div className="container-x">
          <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
            Spare Parts &amp; Components
          </p>
          <h2 className="h2 mt-3  tracking-tight text-brand-950">
            The Right Part. When You Need It.
          </h2>
          <p className="lead max-w-2xl text-neutral-600">
            A wide range of pump, motor and valve spare parts for maintenance,
            replacement and equipment requirements.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPARE_TYPES.map((t) => (
              <li key={t}>
                <Link
                  href={`/spare-parts?type=${encodeURIComponent(t)}`}
                  className="group flex items-center justify-between rounded-xl border border-line bg-white px-6 py-5 text-base font-medium text-brand-950 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/50 hover:text-brand-700 hover:shadow-md"
                >
                  <span>{t}</span>
                  <svg
                    className="h-4 w-4 text-brand-500 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/spare-parts"
              className="btn btn-primary shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 inline-flex items-center gap-2"
            >
              Find Your Spare Part
            </Link>
          </div>
        </div>
      </section>

      {/* 06 — SEARCH */}
      {/* <section className="section-alt section" id="search">
        <div className="container-x">
          <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
            Find what you need
          </p>
          <h2 className="h2">Search products and spare parts</h2>
          <div className="mt-8 max-w-4xl">
            <SearchForm
              action="/products"
              categories={selectable}
              brands={brands}
              applications={apps}
              compact
            />
            <p className="mt-4 text-sm text-muted">
              Try “KSB pump spare”. Can’t find it?{" "}
              <Link
                href="/get-a-quote"
                className="font-semibold text-brand-700 underline underline-offset-4"
              >
                Request availability / quote
              </Link>
              .
            </p>
          </div>
        </div>
      </section> */}

      {/* 07 — FEATURED */}
      {featured.items.length > 0 && (
        <section className="section" id="featured">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Featured Products</p>
                <h2 className="h2">Selected products</h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-semibold text-brand-700"
              >
                View all products ➔
              </Link>
            </div>
            {/* <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.items.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div> */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {featured.items.map((p) => (
                <div
                  key={p.id}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 08 — INDUSTRIES */}
      {industries.length > 0 && (
        <section className="section-alt section" id="industries">
          <div className="container-x">
            <p className="eyebrow">Applications</p>
            <h2 className="h2">Solutions for Different Applications</h2>
            {/* <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((it, i) => (
                <Link key={it.id} href="/industries" className="card group overflow-hidden">
                  {it.imageUrl && <Img src={it.imageUrl} alt={it.name} ratio="16/9" />}
                  <div className="p-6">
                    <span className="text-sm font-semibold text-brand-500">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 text-base font-semibold uppercase tracking-wide text-brand-950">{it.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{it.description}</p>
                  </div>
                </Link>
              ))}
            </div> */}
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((it, i) => (
                <Link
                  key={it.id}
                  href="/industries"
                  className="card group overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-200 p-0 flex flex-col"
                >
                  {it.imageUrl && (
                    <div className="relative overflow-hidden bg-slate-100">
                      <Img
                        src={it.imageUrl}
                        alt={it.name}
                        ratio="16/9"
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col">
                    <span className="inline-flex items-center justify-center rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600 ring-1 ring-inset ring-brand-500/15 w-fit">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-base font-bold uppercase tracking-wide text-slate-900 group-hover:text-brand-600 transition-colors duration-200">
                      {it.name}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600 flex-1">
                      {it.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 09 — WHY */}
      {/* <section className="section" id="why">
        <div className="container-x">
          <p className="eyebrow">Why choose {s.businessName}</p>
          <h2 className="h2">Factual. Practical. Dependable.</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map(([t, d]) => (
              <div key={t} className="border-t-2 border-brand-700 pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-950">
                  {t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="section bg-white py-16" id="why">
        <div className="container-x">
          <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
            Why choose {s.businessName}
          </p>
          <h2 className="h2 mt-3 font-bold tracking-tight text-brand-950">
            Factual. Practical. Dependable.
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map(([t, d]) => (
              <div
                key={t}
                className="group rounded-xl border border-line/80 border-t-2 border-t-brand-700 bg-neutral-50/50 p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-950 transition-colors group-hover:text-brand-700">
                  {t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — ABOUT */}
      <section className="section-alt section" id="about">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            {/* <p className="eyebrow">About {s.businessName}</p> */}
            <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
              About {s.businessName}
            </p>
            <h2 className="h2">Engineering Products. Practical Support.</h2>
            <div className="prose-sp mt-5">
              <p>
                {s.businessName} is a Haryana-based business dealing in pumps,
                motors, valves, KSB products and industrial spare parts.
              </p>
              <p>
                Our focus is on providing quality-oriented products, reliable
                supply and responsive support according to customer
                requirements.
              </p>
            </div>
            <Link href="/about" className="btn btn-outline mt-7">
              About Us
            </Link>
          </div>
          {s.aboutImageUrl && (
            <Img
              src={s.aboutImageUrl}
              alt={`About ${s.businessName}`}
              ratio="4/3"
              className="rounded-md"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          )}
        </div>
      </section>

      {/* 11 — BRANDS */}
      {brands.length > 0 && (
        <section className="section" id="brands">
          <div className="container-x">
            {/* <p className="eyebrow">Our brands &amp; product associations</p> */}
            <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
              Our brands &amp; product associations
            </p>
            <h2 className="h2">Brands we deal with</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((b) => (
                <Link
                  key={b.id}
                  href={brandHref(b)}
                  className="card flex flex-col p-6"
                >
                  <div className="flex h-14 items-center">
                    {b.logoUrl ? (
                      <Img
                        src={b.logoUrl}
                        alt={`${b.name} logo`}
                        ratio="7/4"
                        fit="contain"
                        className="!w-40 bg-transparent"
                        sizes="160px"
                      />
                    ) : (
                      <span className="text-2xl font-bold tracking-[0.16em] text-brand-800">
                        {b.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {b.description}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-brand-700">
                    View Products ➔
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12 — RESOURCES */}
      <section className="section-alt section" id="resources">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              {/* <p className="eyebrow">Resources</p> */}
              <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
                Resources
              </p>
              <h2 className="h2">Catalogues &amp; technical documents</h2>
            </div>
            <Link
              href="/resources"
              className="text-sm font-semibold text-brand-700"
            >
              All resources ➔
            </Link>
          </div>
          {docs.length ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {docs.map((d) => (
                <li key={d.id}>
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card flex items-center justify-between gap-4 p-5 hover:border-brand-500"
                  >
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-brand-600">
                        {d.type}
                      </span>
                      <span className="mt-1 block font-semibold text-brand-950">
                        {d.title}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-brand-700">
                      Download ↓
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-8 flex flex-wrap gap-2">
              {RESOURCE_TYPES.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 13 — FAQ */}
      {faqs.length > 0 && (
        <section className="section" id="faq">
          <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              {/* <p className="eyebrow">FAQ</p> */}
              <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
                FAQ
              </p>
              <h2 className="h2">Frequently asked questions</h2>
            </div>
            <FaqList items={faqs} />
          </div>
        </section>
      )}

      {/* 14 — QUOTE */}
      <section className="bg-brand-900 py-16 text-white lg:py-24" id="quote">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              Get a Quote
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tell us what you need
            </h2>
            <p className="mt-4 max-w-md text-white/70">
              Share the product, model and quantity. We will confirm
              availability and get back to you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href={call} className="btn btn-light">
                Call {s.phone}
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="text-ink">
            <EnquiryForm
              kind="quote"
              id="home-quote"
              callHref={call}
              waHref={wa}
            />
          </div>
        </div>
      </section>

      {/* 15 — CONTACT */}
      <section className="section" id="contact">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <div>
            {/* <p className="eyebrow">Contact</p> */}
            <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
              Contact
            </p>
            <h2 className="h2">Let’s discuss your requirement</h2>
            <dl className="mt-6 space-y-4 text-base">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {s.businessName}
                </dt>
                <dd className="mt-1 whitespace-pre-line text-ink">
                  {s.address}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a className="hover:text-brand-700" href={call}>
                    {s.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    className="hover:text-brand-700"
                    href={`mailto:${s.email}`}
                  >
                    {s.email}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={call} className="btn btn-primary">
                Call Now
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                WhatsApp
              </a>
              <Link href="/contact" className="btn btn-outline">
                Contact page
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-line">
            {s.mapEmbedUrl && (
              <iframe
                title={`${s.businessName} location map`}
                src={s.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-80 w-full border-0"
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
