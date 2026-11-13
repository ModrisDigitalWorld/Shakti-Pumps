import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const metadata: Metadata = pageMeta({ title: "Privacy Policy", description: "How Shakti Pumps collects and uses information submitted through this website.", path: "/privacy-policy" });

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHero title="Privacy Policy" />
      <section className="section">
        <div className="container-x max-w-3xl">
          <div className="prose-sp">
            <p>This policy explains how {s.businessName} (“we”, “us”) handles information you submit through this website.</p>
            <h2>Information we collect</h2>
            <p>When you submit an enquiry or contact form we collect the details you provide: name, company, mobile number, email address, product requirement and message. We may also record the page from which you sent the enquiry.</p>
            <h2>How we use it</h2>
            <ul>
              <li>To respond to your enquiry and provide quotations.</li>
              <li>To follow up on product availability, orders and support requests.</li>
            </ul>
            <p>We do not sell your personal information.</p>
            <h2>Analytics</h2>
            <p>We may use analytics tools to understand how visitors use the site. These may set cookies to measure traffic anonymously.</p>
            <h2>Data security &amp; retention</h2>
            <p>Enquiries are stored securely and accessed only by authorised staff. We keep them only as long as needed to handle your requirement and for ordinary business records.</p>
            <h2>Your choices</h2>
            <p>You may ask us to correct or delete the information you submitted by contacting us at <a href={`mailto:${s.email}`} className="text-brand-700">{s.email}</a>.</p>
            {/* <p className="text-sm">This is a general template. Please have it reviewed to ensure it matches your business practices and applicable law.</p> */}
          </div>
        </div>
      </section>
    </>
  );
}
