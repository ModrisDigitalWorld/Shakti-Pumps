import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHero } from "@/components/site/PageHero";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";
import { first, telHref, waHref } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  title: "Get a Quote – Pumps, Motors, Valves & Spare Parts",
  description: "Request a quote or check availability for pumps, motors, valves, KSB products and spare parts from Shakti Pumps, Karnal.",
  path: "/get-a-quote",
});

export default async function QuotePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const s = await getSettings();
  const spare = first(sp.kind) === "spare" || Boolean(first(sp.spare));
  const defaults = { product: first(sp.product)?.slice(0, 200), model: first(sp.model)?.slice(0, 200), spare: first(sp.spare)?.slice(0, 200) };
  return (
    <>
      <PageHero eyebrow={spare ? "Spare Parts Enquiry" : "Get a Quote"} title={spare ? "Find Your Spare Part" : "Tell Us What You Need"}>
        {spare ? "Share the equipment and the part you need. It takes less than a minute." : "Share the product, model and quantity. We will confirm availability and get back to you."}
      </PageHero>
      <section className="section !pt-12">
        <div className="container-x max-w-3xl">
          <div className="mb-6 flex gap-2 text-sm">
            <Link href="/get-a-quote" className={`rounded-full border px-4 py-2 ${!spare ? "border-brand-700 bg-brand-700 text-white" : "border-line text-muted"}`}>Product quote</Link>
            <Link href="/get-a-quote?kind=spare" className={`rounded-full border px-4 py-2 ${spare ? "border-brand-700 bg-brand-700 text-white" : "border-line text-muted"}`}>Spare part enquiry</Link>
          </div>
          <EnquiryForm key={spare ? "spare" : "quote"} kind={spare ? "spare" : "quote"} id="quote-page" defaults={defaults} callHref={telHref(s.phone)} waHref={waHref(s.whatsapp, "Hello, I would like to request a quote.")} />
        </div>
      </section>
    </>
  );
}
