
// "use client";

// import { useCallback, useEffect, useState } from "react";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { HeroSearch } from "./HeroSearch";

// /** Edit the background images here. Files go in public/slides/ */
// const BACKGROUND_IMAGES = [
//   "/slides/slide-1.jpg",
//   "/slides/slide-2.jpg",
//   "/slides/slide-3.jpg",
// ];

// const DELAY = 4000;

// export function HeroSlider({ ksbDesignation }: { ksbDesignation: string }) {
//   const [i, setI] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const n = BACKGROUND_IMAGES.length;
//   const go = useCallback((x: number) => setI(((x % n) + n) % n), [n]);

//   // No auto-advance for people who prefer reduced motion.
//   useEffect(() => {
//     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
//       setPaused(true);
//     }
//   }, []);

//   // Auto-advance timer.
//   useEffect(() => {
//     if (paused) return;
//     const t = setTimeout(() => setI((x) => (x + 1) % n), DELAY);
//     return () => clearTimeout(t);
//   }, [i, paused, n]);

//   // Handle keyboard arrow navigation when carousel is focused
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "ArrowLeft") {
//       go(i - 1);
//     } else if (e.key === "ArrowRight") {
//       go(i + 1);
//     }
//   };

//   return (
//     <section
//       aria-roledescription="carousel"
//       aria-label="Featured"
//       tabIndex={0}
//       onKeyDown={handleKeyDown}
//       className="relative isolate overflow-hidden bg-brand-950 text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//       onFocus={() => setPaused(true)}
//       onBlur={() => setPaused(false)}
//     >
//       <div className="grid min-h-[34rem] lg:min-h-[32rem]">
//         {/* Background image slides */}
//         {BACKGROUND_IMAGES.map((img, idx) => {
//           const active = idx === i;
//           return (
//             <div
//               key={img}
//               role="group"
//               aria-roledescription="slide"
//               aria-label={`${idx + 1} of ${n}`}
//               aria-hidden={!active}
//               className={cn(
//                 "absolute inset-0 overflow-hidden transition-opacity duration-700 pointer-events-none",
//                 active ? "z-10 opacity-100" : "z-0 opacity-0",
//               )}
//             >
//               {/* background image (slow zoom while visible) */}
//               <div
//                 className={cn(
//                   "absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out",
//                   active ? "scale-105" : "scale-100",
//                 )}
//                 style={{ backgroundImage: `url(${img})` }}
//                 aria-hidden
//               />
//               {/* Dark gradient overlay to guarantee text readability over images */}
//               <div
//                 className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"
//                 aria-hidden
//               />
//             </div>
//           );
//         })}

//         {/* Fixed content displayed over the changing backgrounds */}
//       <div className="relative col-start-1 row-start-1 z-40 flex items-center justify-center">
//           <div className="container-x relative px-12 py-16 text-center sm:px-16 sm:py-20 animate-rise">
//             <div className="mx-auto max-w-3xl">
//               {ksbDesignation && (
//                 <p className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-100 backdrop-blur-md shadow-sm">
//                   <span
//                     className="h-2 w-2 rounded-full bg-brand-300 animate-pulse"
//                     aria-hidden
//                   />
//                   {ksbDesignation}
//                 </p>
//               )}
//               <h1 className="mt-6 text-[2.25rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[5rem] drop-shadow-lg">
//                 Pumps, Motors, Valves
//                 <span className="block text-brand-300 drop-shadow-md">
//                   & Spare Parts
//                 </span>
//               </h1>
//               {/* <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow">
//                 Reliable products and component solutions for water, industrial
//                 and commercial applications.
//               </p> */}
//                  <HeroSearch />
//               {/* <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
//                 <Link
//                   href="/products"
//                   className="btn btn-light w-full py-3.5 sm:w-auto sm:px-8 shadow-lg"
//                 >
//                   Explore Products
//                 </Link>
//                 <Link
//                   href="/get-a-quote"
//                   className="btn btn-ghost-light w-full py-3.5 sm:w-auto sm:px-8 shadow-lg bg-black/20 backdrop-blur-sm"
//                 >
//                   Send an Enquiry
//                 </Link>
//               </div> */}
//               {/* <HeroSearch /> */}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* arrows */}
//       <button
//         type="button"
//         onClick={() => go(i - 1)}
//         aria-label="Previous slide"
//         className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white backdrop-blur-md transition-colors hover:bg-white/30 sm:left-5 shadow-md"
//       >
//         ‹
//       </button>
//       <button
//         type="button"
//         onClick={() => go(i + 1)}
//         aria-label="Next slide"
//         className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white backdrop-blur-md transition-colors hover:bg-white/30 sm:right-5 shadow-md"
//       >
//         ›
//       </button>

//       {/* dots */}
//       <div
//         className="absolute inset-x-0 bottom-5 z-30 flex justify-center gap-2.5"
//         role="tablist"
//         aria-label="Choose slide"
//       >
//         {BACKGROUND_IMAGES.map((img, idx) => (
//           <button
//             key={img}
//             type="button"
//             role="tab"
//             aria-selected={idx === i}
//             aria-label={`Go to slide ${idx + 1}`}
//             onClick={() => go(idx)}
//             className={cn(
//               "h-2.5 rounded-full transition-all shadow-sm",
//               idx === i
//                 ? "w-8 bg-white"
//                 : "w-2.5 bg-white/50 hover:bg-white/80",
//             )}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSearch } from "./HeroSearch";

const BACKGROUND_VIDEO = "/video/hero-bg.mp4";
const POSTER_IMAGE = "/slides/slide-1.jpg";

export function HeroSlider({ ksbDesignation }: { ksbDesignation: string }) {
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    video1Ref.current?.play().catch(() => {});
    video2Ref.current?.play().catch(() => {});
  }, []);

  const handleTimeUpdate = (currentNum: 1 | 2) => {
    const currentVideo = currentNum === 1 ? video1Ref.current : video2Ref.current;
    if (!currentVideo || !currentVideo.duration) return;

    // Switch active video 0.25 seconds before the end for a zero-gap transition
    if (currentVideo.duration - currentVideo.currentTime <= 0.25) {
      const nextNum = currentNum === 1 ? 2 : 1;
      const nextVideo = nextNum === 1 ? video1Ref.current : video2Ref.current;

      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
        setActiveVideo(nextNum);
      }
    }
  };

  return (
    <section
      aria-label="Featured"
      className="relative isolate overflow-hidden bg-brand-950 text-white"
    >
      <div className="grid min-h-[34rem] lg:min-h-[34rem]">
        {/* Background video layer */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-brand-950"
          aria-hidden="true"
        >
          {/* Video 1 */}
          <video
            ref={video1Ref}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-150 ${
              activeVideo === 1 ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            poster={POSTER_IMAGE}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={() => handleTimeUpdate(1)}
          >
            <source src={BACKGROUND_VIDEO} type="video/mp4" />
          </video>

          {/* Video 2 */}
          <video
            ref={video2Ref}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-150 ${
              activeVideo === 2 ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            poster={POSTER_IMAGE}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={() => handleTimeUpdate(2)}
          >
            <source src={BACKGROUND_VIDEO} type="video/mp4" />
          </video>

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-20" />
        </div>

        {/* Content */}
        <div className="relative col-start-1 row-start-1 z-40 flex items-center justify-center">
          <div className="container-x relative px-12 py-16 text-center sm:px-16 sm:py-20 animate-rise">
            <div className="mx-auto max-w-3xl">
              {ksbDesignation && (
                <p className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-100 backdrop-blur-md shadow-sm">
                  <span
                    className="h-2 w-2 rounded-full bg-brand-300 animate-pulse"
                    aria-hidden
                  />
                  {ksbDesignation}
                </p>
              )}
              <h1 className="mt-6 text-[2.25rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[5rem] drop-shadow-lg">
                Pumps, Motors, Valves
                <span className="block text-brand-300 drop-shadow-md">
                  & Spare Parts
                </span>
              </h1>

              <HeroSearch />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}