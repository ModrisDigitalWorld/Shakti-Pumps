export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const digits = (s: string) => s.replace(/\D/g, "");

/** Indian 10-digit numbers get +91; anything longer is assumed to include its country code. */
function intl(p: string) {
  const d = digits(p);
  return d.length === 10 ? `91${d}` : d;
}

export const telHref = (phone: string) => `tel:+${intl(phone)}`;

export const waHref = (phone: string, text?: string) =>
  `https://wa.me/${intl(phone)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
