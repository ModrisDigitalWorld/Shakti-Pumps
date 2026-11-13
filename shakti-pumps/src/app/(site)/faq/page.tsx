import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/site/Faq";
import { PageHero } from "@/components/site/PageHero";
import { getFaqs } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "FAQ – KSB Products, Spare Parts & Quotations",
  description: "Answers to common questions about KSB products, pump spare parts, valve spares, model enquiries and quotations from Shakti Pumps, Karnal.",
  path: "/faq",
});

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <>
      <PageHero eyebrow="FAQ" title="Frequently Asked Questions" />
      <section className="section">
        <div className="container-x max-w-3xl">
          <FaqList items={faqs} />
          <p className="mt-10 text-muted">Still have a question? <Link href="/contact" className="font-semibold text-brand-700">Contact us</Link>.</p>
        </div>
      </section>
    </>
  );
}
