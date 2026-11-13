import type { Metadata } from "next";

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export function pageMeta(o: { title: string; description: string; path: string; image?: string; noindex?: boolean }): Metadata {
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: o.path },
    openGraph: {
      title: o.title,
      description: o.description,
      url: o.path,
      type: "website",
      siteName: "Shakti Pumps",
      locale: "en_IN",
      images: o.image ? [{ url: o.image }] : undefined,
    },
    twitter: { card: o.image ? "summary_large_image" : "summary", title: o.title, description: o.description },
    robots: o.noindex ? { index: false, follow: false } : undefined,
  };
}

export const truncate = (s: string, n = 155) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
