// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import { NAV_LINKS } from "@/lib/constants";
// import { cn } from "@/lib/utils";

// export function Logo({ name, light }: { name: string; light?: boolean }) {
//   return (
//     <span className="flex items-center gap-2.5">
//       <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
//         <rect
//           width="30"
//           height="30"
//           rx="4"
//           className={light ? "fill-white" : "fill-brand-700"}
//         />
//         <circle
//           cx="15"
//           cy="15"
//           r="7"
//           fill="none"
//           strokeWidth="2"
//           className={light ? "stroke-brand-800" : "stroke-white"}
//         />
//         <path
//           d="M15 8v7l5 3"
//           fill="none"
//           strokeWidth="2"
//           strokeLinecap="round"
//           className={light ? "stroke-brand-800" : "stroke-white"}
//         />
//       </svg>
//       <span
//         className={cn(
//           "text-[15px] font-bold uppercase tracking-[0.16em]",
//           light ? "text-white" : "text-brand-950",
//         )}
//       >
//         {name}
//       </span>
//     </span>
//   );
// }

// export function Header({ name }: { name: string }) {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   useEffect(() => setOpen(false), [pathname]);
//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open]);

//   const active = (href: string) =>
//     href === "/" ? pathname === "/" : pathname.startsWith(href);

//   return (
//     <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
//       <div className="container-x flex h-16 items-center justify-between gap-6">
//         <Link href="/" aria-label={`${name} home`}>
//           <Logo name={name} />
//         </Link>

//         <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
//           {NAV_LINKS.map((l) => (
//             <Link
//               key={l.href}
//               href={l.href}
//               aria-current={active(l.href) ? "page" : undefined}
//               className={cn(
//                 "rounded px-3 py-2 text-sm font-medium transition-colors",
//                 active(l.href)
//                   ? "text-brand-700"
//                   : "text-ink/80 hover:text-brand-700",
//               )}
//             >
//               {l.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="flex items-center gap-2">
//           <Link
//             href="/get-a-quote"
//             className="btn btn-primary hidden !py-2.5 sm:inline-flex"
//           >
//             Get a Quote
//           </Link>
//           <button
//             type="button"
//             className="grid h-10 w-10 place-items-center rounded-md border border-line xl:hidden"
//             aria-label={open ? "Close menu" : "Open menu"}
//             aria-expanded={open}
//             onClick={() => setOpen((o) => !o)}
//           >
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 20 20"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.8"
//               strokeLinecap="round"
//             >
//               {open ? (
//                 <path d="M4 4l12 12M16 4L4 16" />
//               ) : (
//                 <path d="M3 6h14M3 10h14M3 14h14" />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>
//       {open && (
//         <div className="fixed inset-x-0 top-16 bottom-0  overflow-y-auto bg-white xl:hidden">
//           <nav aria-label="Mobile" className="container-x flex flex-col py-4">
//             {NAV_LINKS.map((l) => (
//               <Link
//                 key={l.href}
//                 href={l.href}
//                 className={cn(
//                   "border-b border-line py-4 text-lg font-medium",
//                   active(l.href) ? "text-brand-700" : "text-ink",
//                 )}
//               >
//                 {l.label}
//               </Link>
//             ))}
//             <Link
//               href="/get-a-quote"
//               className="btn btn-primary mt-6 py-4 text-base"
//             >
//               Get a Quote
//             </Link>
//           </nav>
//         </div>
//       )}
//     </header>

//     // <header className="sticky top-0 z-50 border-b border-line/80 bg-white/90 shadow-xs backdrop-blur-md transition-all">
//     //   <div className="container-x flex h-16 items-center justify-between gap-6">
//     //     <Link 
//     //       href="/" 
//     //       aria-label={`${name} home`}
//     //       className="transition-opacity hover:opacity-90"
//     //     >
//     //       <Logo name={name} />
//     //     </Link>

//     //     <nav aria-label="Main" className="hidden items-center gap-1.5 xl:flex">
//     //       {NAV_LINKS.map((l) => (
//     //         <Link
//     //           key={l.href}
//     //           href={l.href}
//     //           aria-current={active(l.href) ? "page" : undefined}
//     //           className={cn(
//     //             "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
//     //             active(l.href)
//     //               ? "bg-brand-50/80 text-brand-700 shadow-xs"
//     //               : "text-ink/80 hover:bg-neutral-100/60 hover:text-brand-700",
//     //           )}
//     //         >
//     //           {l.label}
//     //         </Link>
//     //       ))}
//     //     </nav>

//     //     <div className="flex items-center gap-3">
//     //       <Link
//     //         href="/get-a-quote"
//     //         className="btn btn-primary hidden !py-2.5 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 sm:inline-flex"
//     //       >
//     //         Get a Quote
//     //       </Link>
//     //       <button
//     //         type="button"
//     //         className="grid h-10 w-10 place-items-center rounded-xl border border-line/80 bg-neutral-50/50 text-ink transition-colors hover:bg-neutral-100 xl:hidden"
//     //         aria-label={open ? "Close menu" : "Open menu"}
//     //         aria-expanded={open}
//     //         onClick={() => setOpen((o) => !o)}
//     //       >
//     //         <svg
//     //           width="20"
//     //           height="20"
//     //           viewBox="0 0 20 20"
//     //           fill="none"
//     //           stroke="currentColor"
//     //           strokeWidth="1.8"
//     //           strokeLinecap="round"
//     //         >
//     //           {open ? (
//     //             <path d="M4 4l12 12M16 4L4 16" />
//     //           ) : (
//     //             <path d="M3 6h14M3 10h14M3 14h14" />
//     //           )}
//     //         </svg>
//     //       </button>
//     //     </div>
//     //   </div>
      
//     //   {open && (
//     //     <div className="fixed inset-x-0 top-16 bottom-0 z-40 animate-in fade-in slide-in-from-top-2 overflow-y-auto bg-white/98 backdrop-blur-xl xl:hidden">
//     //       <nav aria-label="Mobile" className="container-x flex flex-col py-6">
//     //         {NAV_LINKS.map((l) => (
//     //           <Link
//     //             key={l.href}
//     //             href={l.href}
//     //             className={cn(
//     //               "border-b border-line/60 py-4 text-lg font-medium transition-colors hover:text-brand-700",
//     //               active(l.href) ? "text-brand-700 font-semibold" : "text-ink",
//     //             )}
//     //           >
//     //             {l.label}
//     //           </Link>
//     //         ))}
//     //         <Link
//     //           href="/get-a-quote"
//     //           className="btn btn-primary mt-6 py-4 text-center text-base shadow-sm"
//     //         >
//     //           Get a Quote
//     //         </Link>
//     //       </nav>
//     //     </div>
//     //   )}
//     // </header>
//   );
// }






"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ name, light }: { name: string; light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
        <rect width="30" height="30" rx="4" className={light ? "fill-white" : "fill-brand-700"} />
        <circle cx="15" cy="15" r="7" fill="none" strokeWidth="2" className={light ? "stroke-brand-800" : "stroke-white"} />
        <path d="M15 8v7l5 3" fill="none" strokeWidth="2" strokeLinecap="round" className={light ? "stroke-brand-800" : "stroke-white"} />
      </svg>
      <span className={cn("text-[15px] font-bold uppercase tracking-[0.16em]", light ? "text-white" : "text-brand-950")}>{name}</span>
    </span>
  );
}

export function Header({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

   return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label={`${name} home`}>
            <Logo name={name} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active(l.href) ? "page" : undefined}
                className={cn(
                  "rounded px-3 py-2 text-lg transition-colors",
                  active(l.href) ? "text-brand-700" : "text-ink/80 hover:text-brand-700",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/get-a-quote" className="btn btn-primary hidden !py-2.5 sm:inline-flex">
              Get a Quote
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-md border border-line xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Must be outside <header>, otherwise the header's backdrop-blur collapses this panel */}
      {open && (
        <div className="fixed inset-x-0 top-16 z-[45] h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-white xl:hidden">
          <nav aria-label="Mobile" className="container-x flex flex-col pb-10 pt-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "border-b border-line py-4 text-lg font-medium",
                  active(l.href) ? "text-brand-700" : "text-ink",
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/get-a-quote" className="btn btn-primary mt-6 py-4 text-base">
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </>
  );

}
