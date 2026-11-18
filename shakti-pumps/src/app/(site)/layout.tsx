import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyContact } from "@/components/site/StickyContact";
import { JsonLd } from "@/components/site/JsonLd";
import { getCategories } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { CookieConsent } from "@/components/site/CookieConsent";
import { siteUrl } from "@/lib/seo";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, categories] = await Promise.all([getSettings(), getCategories()]);
  const base = siteUrl();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header name={s.businessName} />
      <main id="main">{children}</main>
      <Footer s={s} categories={categories} />
      <StickyContact phone={s.phone} whatsapp={s.whatsapp} />
        <WhatsAppButton whatsapp={s.whatsapp} />
      <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_ID} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${base}/#business`,
          name: s.businessName,
          description: `${s.ksbDesignation}. Pumps, motors, valves, KSB products and spare parts.`,
          url: base,
          telephone: s.phone,
          email: s.email,
          address: { "@type": "PostalAddress", streetAddress: s.address, addressLocality: "Karnal", addressRegion: "Haryana", addressCountry: "IN" },
          areaServed: { "@type": "AdministrativeArea", name: "Haryana" },
          ...(s.establishedYear ? { foundingDate: s.establishedYear } : {}),
        }}
      />
    </>
  );
}
