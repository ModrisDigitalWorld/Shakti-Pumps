import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/queries";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const statics = ["", "/about", "/products", "/ksb", "/spare-parts", "/industries", "/resources", "/faq", "/contact", "/get-a-quote", "/privacy-policy", "/terms"];
  const entries = await getSitemapEntries();
  return [
    ...statics.map((p) => ({
      url: `${base}${p}`,
      changeFrequency: (p === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: p === "" ? 1 : ["/products", "/ksb", "/spare-parts"].includes(p) ? 0.9 : 0.6,
    })),
    ...entries.map((e) => ({
      url: `${base}/${e.kind === "spare" ? "spare-parts" : "products"}/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
