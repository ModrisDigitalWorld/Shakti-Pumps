import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHero } from "@/components/site/PageHero";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";
import { telHref, waHref } from "@/lib/utils";



export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Contact Shakti Pumps – Karnal, Haryana",
  description: "Contact Shakti Pumps, Karnal, Haryana for pumps, motors, valves, KSB products and spare parts. Call, WhatsApp, email or send an enquiry.",
  path: "/contact",
});

export default async function ContactPage() {
  const s = await getSettings();
  const call = telHref(s.phone);
  const wa = waHref(s.whatsapp, "Hello, I would like to discuss a requirement.");
  const rows: [string, string, string?][] = [
    ["Phone", s.phone, telHref(s.phone)],
    ["Enquiries", s.enquiryPhone, telHref(s.enquiryPhone)],
    ["Complaints / Support", s.supportPhone, telHref(s.supportPhone)],
    ["Email", s.email, `mailto:${s.email}`],
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s Discuss Your Requirement" />
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">{s.businessName}</h2>
            <p className="mt-3 whitespace-pre-line text-xl font-semibold text-brand-950">{s.address}</p>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {rows.filter(([, v]) => v).map(([k, v, href]) => (
                <div key={k} className="grid grid-cols-[11rem_1fr] gap-4 py-4 text-sm">
                  <dt className="font-semibold text-brand-950">{k}</dt>
                  <dd><a href={href} className="text-muted hover:text-brand-700">{v}</a></dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={call} className="btn btn-primary">Call Now</a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa">WhatsApp</a>
              <a href={`mailto:${s.email}`} className="btn btn-outline">Email Us</a>
            </div>
            <div className="mt-10 overflow-hidden rounded-md border border-line">
              {s.mapEmbedUrl && <iframe title={`${s.businessName} location map`} src={s.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block h-72 w-full border-0" />}
            </div>
          </div>
          <div>
            <h2 className="mb-5 text-2xl font-semibold text-brand-950">Send us a message</h2>
            <EnquiryForm kind="contact" id="contact-form" callHref={call} waHref={wa} />
          </div>
        </div>
      </section>
    </>
  );
}
