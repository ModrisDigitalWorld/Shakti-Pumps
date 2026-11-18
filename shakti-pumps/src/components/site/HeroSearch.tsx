"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Option = { label: string; meta?: string; href: string };

const POPULAR = ["KSB pump spare", "Mechanical seals", "Impellers", "Valves", "Motors", "Bearings"];
const searchHref = (q: string) => (q ? `/products?q=${encodeURIComponent(q)}` : "/products");

export function HeroSearch() {
  const router = useRouter();
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [found, setFound] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const term = q.trim();

  // Suggestions from the database (debounced).
  useEffect(() => {
    setActive(-1);
    if (term.length < 2) {
      setFound([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const data = await res.json();
        setFound((data.items ?? []).map((i: { name: string; meta: string; href: string }) => ({ label: i.name, meta: i.meta, href: i.href })));
      } catch {
        /* aborted or offline */
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [term]);

  // Close when clicking outside.
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const options: Option[] =
    term.length < 2
      ? POPULAR.map((p) => ({ label: p, meta: "Popular search", href: searchHref(p) }))
      : [...found, { label: `See all results for “${term}”`, href: searchHref(term) }];

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    go(active >= 0 && options[active] ? options[active].href : searchHref(term));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a <= 0 ? options.length - 1 : a - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    // stopPropagation: typing/arrow keys here must not move the hero slider
    <div ref={box} className="relative mx-auto mt-8 w-full max-w-xl text-left" onKeyDown={(e) => e.stopPropagation()}>
      <form role="search" onSubmit={onSubmit} className="flex overflow-hidden rounded-xl bg-white shadow-xl shadow-black/20 border border-white/20">
        <label htmlFor={`${id}-q`} className="sr-only">Search products and spare parts</label>
        <input
          id={`${id}-q`}
          type="search"
          name="q"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          placeholder="Search product, model or spare part…"
          className="min-w-0 flex-1 px-5 py-4 text-base text-neutral-900 outline-none placeholder:text-neutral-400 bg-transparent"
        />
        <button type="submit" className="bg-brand-700 px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500">
          Search
        </button>
      </form>

      {open && (
        <ul 
          id={`${id}-list`} 
          role="listbox" 
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-neutral-200/80 bg-white text-neutral-900 shadow-2xl backdrop-blur-lg divide-y divide-neutral-100"
        >
          {term.length >= 2 && loading && found.length === 0 && (
            <li className="px-5 py-4 text-sm text-neutral-500">Searching…</li>
          )}
          
          {term.length < 2 && (
            <li className="px-5 pt-3.5 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400 bg-neutral-50/70" aria-hidden>
              Popular searches
            </li>
          )}

          {options.map((o, idx) => (
            <li
              key={o.href + o.label}
              id={`${id}-opt-${idx}`}
              role="option"
              aria-selected={idx === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(idx)}
              onClick={() => go(o.href)}
              className={cn(
                "cursor-pointer px-5 py-3 transition-colors",
                idx === active ? "bg-brand-50" : "hover:bg-neutral-50",
                idx === options.length - 1 && term.length >= 2 && "border-t border-neutral-100 bg-neutral-50/50"
              )}
            >
              <span className={cn("block text-sm", idx === options.length - 1 && term.length >= 2 ? "font-semibold text-brand-700" : "font-medium text-neutral-900")}>
                {o.label}
              </span>
              {o.meta && <span className="block text-xs text-neutral-500 mt-0.5">{o.meta}</span>}
            </li>
          ))}

          {term.length >= 2 && !loading && found.length === 0 && (
            <li className="px-5 py-4 text-xs text-neutral-500" aria-hidden>
              No quick matches. Press Search to see all results.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}