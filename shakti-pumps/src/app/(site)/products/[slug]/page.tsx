import type { Metadata } from "next";
import { ProductDetail } from "@/components/site/ProductDetail";
import { getProductBySlug } from "@/lib/queries";
import { pageMeta, truncate } from "@/lib/seo";

export const revalidate = 60;
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug, "product");
  if (!p) return { title: "Product not found", robots: { index: false } };
  return pageMeta({
    title: `${p.name}${p.brandName ? ` – ${p.brandName}` : ""} | Karnal, Haryana`,
    description: truncate(p.shortDescription || p.overview || `${p.name} from Shakti Pumps, Karnal, Haryana. Request a quote.`),
    path: `/products/${p.slug}`,
    image: p.imageUrl || undefined,
  });
}

export default async function Page({ params }: P) {
  return <ProductDetail slug={(await params).slug} kind="product" />;
}
