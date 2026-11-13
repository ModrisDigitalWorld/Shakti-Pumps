import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { DOC_TYPES } from "@/lib/constants";
import { getDocuments } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Resources – Product Catalogues, Brochures & Technical Documents",
  description: "Download product catalogues, brochures, datasheets and technical documents from Shakti Pumps.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const docs = await getDocuments();
  const groups = DOC_TYPES.map((t) => ({ type: t, items: docs.filter((d) => d.type === t) })).filter((g) => g.items.length);
  return (
    <>
      <PageHero eyebrow="Resources" title="Catalogues & Technical Documents" />
      <section className="section">
        <div className="container-x space-y-12">
          {groups.length === 0 && (
            <div className="card p-10 text-center">
              <h2 className="text-xl font-semibold text-brand-950">Documents coming soon</h2>
              <p className="mt-2 text-muted">Catalogues, brochures and datasheets will be published here as they become available. For a specific document, please contact us.</p>
            </div>
          )}
          {groups.map((g) => (
            <div key={g.type}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">{g.type}s</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {g.items.map((d) => (
                  <li key={d.id}>
                    <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="card flex items-start justify-between gap-4 p-5 hover:border-brand-500">
                      <span>
                        <span className="block font-semibold text-brand-950">{d.title}</span>
                        {d.description && <span className="mt-1 block text-sm text-muted">{d.description}</span>}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-brand-700">Download ↓</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
