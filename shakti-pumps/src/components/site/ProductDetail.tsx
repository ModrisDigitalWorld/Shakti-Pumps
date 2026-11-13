import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Img } from "@/components/site/Img";
import { JsonLd } from "@/components/site/JsonLd";
import { ProductCard } from "@/components/site/ProductCard";
import { getProductBySlug, getRelated } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/seo";
import { telHref, waHref } from "@/lib/utils";

export async function ProductDetail({ slug, kind }: { slug: string; kind: "product" | "spare" }) {
  const p = await getProductBySlug(slug, kind);
  if (!p) notFound();
  const [s, related] = await Promise.all([getSettings(), getRelated(p)]);
  const spare = kind === "spare";
  const base = siteUrl();
  const listHref = spare ? "/spare-parts" : "/products";
  const call = telHref(s.phone);
  const wa = waHref(s.whatsapp, `Hello, I would like to enquire about: ${p.name}`);

  const info: [string, string][] = spare
    ? [
        ["Part name", p.name],
        ["Part type", p.partType],
        ["Brand", p.brandName ?? ""],
        ["Compatible equipment", p.compatibleEquipment],
        ["Model", p.models.join(", ")],
        ["Application", p.applications.join(", ")],
        ["Material / specification", p.material],
        ["Availability", p.availability],
      ]
    : [];
  const infoRows = info.filter(([, v]) => v);

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-x py-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: spare ? "Spare Parts" : "Products", href: listHref },
              { label: p.name },
            ]}
          />
        </div>
      </div>

      <section className="section !py-10 lg:!py-14">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <Img src={p.imageUrl} alt={p.name} ratio="4/3" fit="contain" priority sizes="(min-width: 1024px) 50vw, 100vw" className="rounded-md border border-line" />
            {p.gallery.length > 0 && (
              <ul className="mt-3 grid grid-cols-4 gap-3">
                {p.gallery.slice(0, 8).map((g, i) => (
                  <li key={g + i}>
                    <a href={g} target="_blank" rel="noopener noreferrer" aria-label={`View image ${i + 1} of ${p.name}`}>
                      <Img src={g} alt={`${p.name} — view ${i + 2}`} ratio="1/1" fit="contain" sizes="120px" className="rounded border border-line" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-x-4 text-xs font-semibold uppercase tracking-wider text-brand-600">
              {p.brandName && <span>{p.brandName}</span>}
              {spare ? p.partType && <span className="text-muted">{p.partType}</span> : p.categoryName && <span className="text-muted">{p.categoryName}</span>}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">{p.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{p.shortDescription}</p>
            {p.availability && <p className="mt-5 text-sm"><span className="font-semibold text-brand-950">Availability:</span> <span className="text-muted">{p.availability}</span></p>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className="btn btn-primary py-3.5">{spare ? "Send Spare Parts Enquiry" : "Request a Quote"}</a>
              <a href={call} className="btn btn-outline py-3.5">Call Now</a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa py-3.5">WhatsApp</a>
            </div>

            {spare && infoRows.length > 0 && (
              <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
                {infoRows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 py-3">
                    <dt className="font-semibold text-brand-950">{k}</dt>
                    <dd className="text-muted">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>

      {(p.overview || p.features.length > 0 || p.specs.length > 0 || p.applications.length > 0 || (!spare && p.models.length > 0)) && (
        <section className="border-t border-line bg-white py-12 lg:py-16">
          <div className="container-x grid gap-12 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              {p.overview && (
                <div>
                  <h2 className="text-xl font-semibold text-brand-950">{spare ? "Additional notes" : "Overview"}</h2>
                  <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted">{p.overview}</p>
                </div>
              )}
              {p.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-brand-950">Key features</h2>
                  <ul className="mt-3 grid gap-x-8 gap-y-2 text-muted sm:grid-cols-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden />{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {p.specs.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-brand-950">Technical specifications</h2>
                  <table className="mt-3 w-full border-y border-line text-sm">
                    <tbody className="divide-y divide-line">
                      {p.specs.map((sp) => (
                        <tr key={sp.label}>
                          <th scope="row" className="w-2/5 py-3 pr-4 text-left font-semibold text-brand-950">{sp.label}</th>
                          <td className="py-3 text-muted">{sp.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <aside className="space-y-10">
              {p.applications.length > 0 && !spare && (
                <div>
                  <h2 className="text-xl font-semibold text-brand-950">Applications</h2>
                  <ul className="mt-3 space-y-2 text-muted">{p.applications.map((a) => <li key={a}>{a}</li>)}</ul>
                </div>
              )}
              {p.models.length > 0 && !spare && (
                <div>
                  <h2 className="text-xl font-semibold text-brand-950">Available models</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">{p.models.map((m) => <li key={m} className="rounded border border-line px-3 py-1.5 text-sm text-ink">{m}</li>)}</ul>
                </div>
              )}
            </aside>
          </div>
        </section>
      )}

      <section className="bg-brand-900 py-14 text-white lg:py-20" id="quote">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">{spare ? "Spare Parts Enquiry" : "Get a Quote"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{spare ? "Need this spare part?" : "Need This Product?"}</h2>
            <p className="mt-4 max-w-md text-white/70">Share your details and requirement. We will confirm availability and respond quickly.</p>
          </div>
          <div className="text-ink">
            <EnquiryForm
              kind={spare ? "spare" : "quote"}
              id="detail-enquiry"
              productId={p.id}
              defaults={spare ? { spare: p.name, product: p.compatibleEquipment || p.models[0] } : { product: p.name }}
              callHref={call}
              waHref={wa}
            />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="container-x">
            <h2 className="text-2xl font-semibold tracking-tight text-brand-950">Related {spare ? "spare parts" : "products"}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => <ProductCard key={r.id} p={r} />)}
            </div>
            <Link href={listHref} className="mt-8 inline-block text-sm font-semibold text-brand-700">← Back to {spare ? "spare parts" : "products"}</Link>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.shortDescription || p.overview,
          url: `${base}${listHref}/${p.slug}`,
          ...(p.imageUrl ? { image: p.imageUrl } : {}),
          ...(p.brandName ? { brand: { "@type": "Brand", name: p.brandName } } : {}),
          ...(p.categoryName ? { category: p.categoryName } : {}),
        }}
      />
    </>
  );
}
