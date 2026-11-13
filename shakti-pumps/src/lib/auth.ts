import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifySessionToken } from "./session";

const sha = (s: string) => createHash("sha256").update(s).digest();
const same = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));

export function checkCredentials(email: string, password: string) {
  const e = process.env.ADMIN_EMAIL;
  const p = process.env.ADMIN_PASSWORD;
  if (!e || !p) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  // Evaluate both so timing doesn't reveal which one was wrong.
  const okEmail = same(email.trim().toLowerCase(), e.trim().toLowerCase());
  const okPass = same(password, p);
  return okEmail && okPass;
}

export async function getAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE)?.value);
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
