import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const metadata: Metadata = pageMeta({ title: "Terms & Conditions", description: "Terms of use for the Shakti Pumps website.", path: "/terms" });

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHero title="Terms & Conditions" />
      <section className="section">
        <div className="container-x max-w-3xl">
          <div className="prose-sp">
            <p>By using this website you agree to the following terms.</p>
            <h2>Information on this website</h2>
            <p>Product information is provided for general guidance. Specifications, models, availability and prices may change and must be confirmed with {s.businessName} before purchase.</p>
            <h2>Enquiries and quotations</h2>
            <p>Submitting an enquiry does not create a contract. A quotation is valid only as stated in the quotation itself.</p>
            <h2>Brands and trademarks</h2>
            <p>Brand names, logos and product images belong to their respective owners and are shown only to identify products we supply. Display of a brand does not imply endorsement beyond the dealership relationship stated on this site.</p>
            <h2>Limitation</h2>
            <p>We make reasonable efforts to keep this site accurate and available but do not guarantee it is free of errors or interruptions.</p>
            <h2>Contact</h2>
            <p>Questions about these terms: <a href={`mailto:${s.email}`} className="text-brand-700">{s.email}</a>.</p>
            {/* <p className="text-sm">This is a general template. Please have it reviewed before relying on it.</p> */}
          </div>
        </div>
      </section>
    </>
  );
}
