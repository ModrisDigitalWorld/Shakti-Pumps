import type { Brand, Category, Product } from "@/lib/db/schema";

export const categoryHref = (c: Pick<Category, "slug" | "href">) => c.href || `/products?category=${encodeURIComponent(c.slug)}`;

export const brandHref = (b: Pick<Brand, "slug">) => (b.slug === "ksb" ? "/ksb" : `/products?brand=${encodeURIComponent(b.slug)}`);

export const productHref = (p: Pick<Product, "slug" | "kind">) => `/${p.kind === "spare" ? "spare-parts" : "products"}/${p.slug}`;
