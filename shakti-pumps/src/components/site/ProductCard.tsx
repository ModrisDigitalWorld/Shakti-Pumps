import Link from "next/link";
import type { ProductRow } from "@/lib/queries";
import { Img } from "./Img";
import { productHref } from "./links";

export function ProductCard({ p }: { p: ProductRow }) {
  const href = productHref(p);
  const quote = `/get-a-quote?${new URLSearchParams({ [p.kind === "spare" ? "spare" : "product"]: p.name }).toString()}`;
  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={href} className="block" aria-label={p.name}>
        <Img src={p.imageUrl} alt={p.name} fit="contain" className="border-b border-line" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-x-3 text-xs font-semibold uppercase tracking-wider text-brand-600">
          {p.brandName && <span>{p.brandName}</span>}
          {p.kind === "spare" ? p.partType && <span className="text-muted">{p.partType}</span> : p.categoryName && <span className="text-muted">{p.categoryName}</span>}
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-brand-950">
          <Link href={href} className="hover:text-brand-700">{p.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{p.shortDescription}</p>
        <div className="mt-auto flex gap-2 pt-5">
          <Link href={href} className="btn btn-outline btn-sm flex-1">View Details</Link>
          <Link href={quote} className="btn btn-primary btn-sm flex-1">Request Quote</Link>
        </div>
      </div>
    </article>
  );
}
