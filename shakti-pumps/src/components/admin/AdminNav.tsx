// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";

// const ITEMS = [
//   { label: "Dashboard", href: "/admin" },
//   { label: "Enquiries", href: "/admin/enquiries" },
//   { label: "Products", href: "/admin/products" },
//   { label: "Spare Parts", href: "/admin/spare-parts" },
//   { label: "Brands", href: "/admin/brands" },
//   { label: "Categories", href: "/admin/categories" },
//   { label: "Industries", href: "/admin/industries" },
//   { label: "Resources", href: "/admin/resources" },
//   { label: "FAQs", href: "/admin/faqs" },
//   { label: "Site settings", href: "/admin/settings" },
// ];

// export function AdminNav({ email }: { email: string }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const active = (h: string) => (h === "/admin" ? pathname === "/admin" : pathname.startsWith(h));

//   async function logout() {
//     await fetch("/api/admin/logout", { method: "POST" });
//     router.push("/admin/login");
//     router.refresh();
//   }

//   return (
//     <aside className="border-b border-line bg-brand-950 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-white/10">
//       <div className="flex items-center justify-between px-5 py-4 lg:block">
//         <div>
//           <p className="text-sm font-bold uppercase tracking-[0.16em]">Shakti Pumps</p>
//           <p className="text-xs text-white/50">Admin panel</p>
//         </div>
//         <button onClick={logout} className="text-xs text-white/70 underline lg:hidden">Log out</button>
//       </div>
//       <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
//         {ITEMS.map((i) => (
//           <Link
//             key={i.href}
//             href={i.href}
//             className={cn(
//               "whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
//               active(i.href) ? "bg-white/15 font-semibold text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
//             )}
//           >
//             {i.label}
//           </Link>
//         ))}
//       </nav>
//       <div className="hidden border-t border-white/10 p-4 text-xs lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
//         <p className="truncate text-white/50">{email}</p>
//         <div className="mt-2 flex gap-4">
//           <a href="/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">View site ↗</a>
//           <button onClick={logout} className="text-white/80 hover:text-white">Log out</button>
//         </div>
//       </div>
//     </aside>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Enquiries", href: "/admin/enquiries" },
  { label: "Products", href: "/admin/products" },
  { label: "Spare Parts", href: "/admin/spare-parts" },
  { label: "Brands", href: "/admin/brands" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Industries", href: "/admin/industries" },
  { label: "Resources", href: "/admin/resources" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Site settings", href: "/admin/settings" },
    { label: "Account", href: "/admin/account" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = (h: string) =>
    h === "/admin" ? pathname === "/admin" : pathname.startsWith(h);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex flex-col border-b border-line bg-brand-950 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-white/10">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 lg:block lg:border-b lg:border-white/10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-white">
            Shakti Pumps
          </p>
          <p className="text-xs text-white/50">Admin panel</p>
        </div>
        <button
          onClick={logout}
          className="text-xs text-white/70 underline transition-colors hover:text-white lg:hidden"
        >
          Log out
        </button>
      </div>

      {/* Navigation List */}
      <nav
        aria-label="Admin"
        className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-y-auto lg:px-4 lg:py-6"
      >
        {ITEMS.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "relative flex items-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200",
              active(i.href)
                ? "bg-white/15 font-semibold text-white shadow-xs lg:before:absolute lg:before:left-0 lg:before:top-2 lg:before:bottom-2 lg:before:w-1 lg:before:rounded-r-full lg:before:bg-brand-500"
                : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            {i.label}
          </Link>
        ))}
      </nav>

      {/* User Footer */}
      <div className="hidden border-t border-white/10 bg-white/5 p-4 text-xs lg:block">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 font-semibold text-white">
            {email ? email[0].toUpperCase() : "A"}
          </div>
          <p className="truncate text-sm text-white/60">{email}</p>
        </div>
        <div className="mt-3 flex items-center gap-4 border-t border-white/10 pt-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 transition-colors hover:text-white"
          >
            View site ↗
          </a>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition-all hover:bg-red-500/20 hover:text-red-200 hover:border-red-500/50 active:scale-95 cursor-pointer"
          >
            <svg
              className="h-3.5 w-3.5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H9"
              />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
