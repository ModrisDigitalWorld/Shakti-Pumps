/** Compact page header used on inner pages. */
export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="bg-brand-900 text-white">
      <div className="container-x py-14 sm:py-20">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl animate-rise text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{children}</div>}
      </div>
    </section>
  );
}
