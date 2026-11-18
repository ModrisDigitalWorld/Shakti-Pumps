import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/queries";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Public, read-only: product / spare-part name suggestions for the hero search box. */
export async function GET(req: Request) {
  if (!rateLimit(`suggest:${clientIp(req)}`, 60, 60_000)) return NextResponse.json({ items: [] }, { status: 429 });
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 60);
  if (q.length < 2) return NextResponse.json({ items: [] });

  const { items } = await searchProducts({ q, pageSize: 6 });
  return NextResponse.json(
    {
      items: items.map((p) => ({
        name: p.name,
        href: `${p.kind === "spare" ? "/spare-parts" : "/products"}/${p.slug}`,
        meta: [p.kind === "spare" ? "Spare part" : "Product", p.brandName, p.categoryName].filter(Boolean).join(" · "),
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}