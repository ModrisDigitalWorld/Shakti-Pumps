import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import type { Category } from "@/lib/db/schema";
import type { SiteSettings } from "@/lib/site-defaults";
import { telHref, waHref } from "@/lib/utils";
import { Logo } from "./Header";
import { categoryHref } from "./links";
import { CookieSettingsButton } from "./CookieConsent";
import { SocialLinks } from "./SocialLinks";

export function Footer({ s, categories }: { s: SiteSettings; categories: Category[] }) {
  return (
    <footer className="bg-brand-950 pb-24 text-white/75 md:pb-0">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo name={s.businessName} light />
          <p className="mt-4 text-sm leading-relaxed">Pumps | Motors | Valves | KSB Products | Spare Parts</p>
          <p className="mt-3 text-sm text-white/50">{s.ksbDesignation}</p>
            <SocialLinks s={s} />
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Product categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={categoryHref(c)} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="whitespace-pre-line">{s.address}</li>
            <li>
              Phone: <a className="hover:text-white" href={telHref(s.phone)}>{s.phone}</a>
            </li>
            <li>
              Email: <a className="hover:text-white" href={`mailto:${s.email}`}>{s.email}</a>
            </li>
            <li>
              <a className="hover:text-white" href={waHref(s.whatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </li>
          </ul>
          <h3 className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-white">Legal</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><CookieSettingsButton className="hover:text-white" /></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 text-xs text-white/50">© {new Date().getFullYear()} {s.businessName}. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
