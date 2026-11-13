import { SPARE_TYPES } from "@/lib/constants";

interface Props {
  action: string;
  values?: { q?: string; category?: string; brand?: string; model?: string; application?: string; type?: string };
  categories?: { slug: string; name: string }[];
  brands?: { slug: string; name: string }[];
  applications?: string[];
  mode?: "product" | "spare";
  compact?: boolean;
  dark?: boolean;
}

const Select = ({ name, label, value, children }: { name: string; label: string; value?: string; children: React.ReactNode }) => (
  <div>
    <label className="label" htmlFor={`f-${name}`}>{label}</label>
    <select id={`f-${name}`} name={name} defaultValue={value ?? ""} className="input">
      {children}
    </select>
  </div>
);

/** Plain GET form — works without JavaScript and keeps every search URL shareable / indexable. */
export function SearchForm({ action, values = {}, categories = [], brands = [], applications = [], mode = "product", compact }: Props) {
  return (
    <form action={action} method="get" role="search" className="card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="f-q" className="sr-only">Search</label>
          <input id="f-q" type="search" name="q" defaultValue={values.q} placeholder="Search by product name, model or spare part..." className="input !py-3" />
        </div>
        <button type="submit" className="btn btn-primary sm:px-8">Search</button>
      </div>
      <div className={`mt-4 grid gap-3 sm:grid-cols-2 ${compact ? "lg:grid-cols-2" : "lg:grid-cols-4"}`}>
        {mode === "product" ? (
          <Select name="category" label="Category" value={values.category}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </Select>
        ) : (
          <Select name="type" label="Part type" value={values.type}>
            <option value="">All types</option>
            {SPARE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        )}
        <Select name="brand" label="Brand" value={values.brand}>
          <option value="">All brands</option>
          {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
        </Select>
        {!compact && (
          <>
            <div>
              <label className="label" htmlFor="f-model">Model</label>
              <input id="f-model" name="model" defaultValue={values.model} placeholder="e.g. model number" className="input" />
            </div>
            <Select name="application" label="Application" value={values.application}>
              <option value="">All applications</option>
              {applications.map((a) => <option key={a} value={a}>{a}</option>)}
            </Select>
          </>
        )}
      </div>
    </form>
  );
}
