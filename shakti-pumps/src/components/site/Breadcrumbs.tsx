import Link from "next/link";
import { siteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const base = siteUrl();
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-2">
              {it.href ? <Link href={it.href} className="hover:text-brand-700">{it.label}</Link> : <span className="text-ink">{it.label}</span>}
              {i < items.length - 1 && <span aria-hidden>/</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.label,
            ...(it.href ? { item: `${base}${it.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
