import type { Metadata } from "next";
import { ProductDetail } from "@/components/site/ProductDetail";
import { getProductBySlug } from "@/lib/queries";
import { pageMeta, truncate } from "@/lib/seo";

export const revalidate = 60;
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug, "spare");
  if (!p) return { title: "Spare part not found", robots: { index: false } };
  return pageMeta({
    title: `${p.name}${p.brandName ? ` – ${p.brandName}` : ""} Spare Part | Karnal, Haryana`,
    description: truncate(p.shortDescription || `${p.name} spare part from Shakti Pumps, Karnal, Haryana. Send an enquiry.`),
    path: `/spare-parts/${p.slug}`,
    image: p.imageUrl || undefined,
  });
}

export default async function Page({ params }: P) {
  return <ProductDetail slug={(await params).slug} kind="spare" />;
}
