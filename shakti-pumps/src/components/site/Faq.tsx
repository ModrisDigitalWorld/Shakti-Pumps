import type { Faq } from "@/lib/db/schema";
import { JsonLd } from "./JsonLd";

export function FaqList({ items }: { items: Faq[] }) {
  if (!items.length) return null;
  return (
    <>
      <div className="divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.id} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-brand-950 [&::-webkit-details-marker]:hidden">
              {f.question}
              <span className="text-xl text-brand-600 transition-transform group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
        }}
      />
    </>
  );
}
