// import "server-only";
// import { createHash, timingSafeEqual } from "node:crypto";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { COOKIE, verifySessionToken } from "./session";


import "server-only";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { settings } from "./db/schema";
import { COOKIE, verifySessionToken } from "./session";

const sha = (s: string) => createHash("sha256").update(s).digest();
const same = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));


function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyHash(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, "hex");
  const b = scryptSync(password, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}

type StoredAdmin = { email: string; passwordHash: string };

async function getStoredAdmin(): Promise<StoredAdmin | null> {
  try {
    const [row] = await db().select().from(settings).where(eq(settings.key, "admin")).limit(1);
    const v = row?.value as Partial<StoredAdmin> | undefined;
    return v?.email && v?.passwordHash ? (v as StoredAdmin) : null;
  } catch {
    return null;
  }
}

export async function saveAdmin(email: string, password: string) {
  const value = { email: email.trim().toLowerCase(), passwordHash: hashPassword(password) };
  await db()
    .insert(settings)
    .values({ key: "admin", value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

export async function checkCredentials(email: string, password: string) {
  const e = email.trim().toLowerCase();
  const stored = await getStoredAdmin();
  if (stored) {
    const okEmail = same(e, stored.email);
    const okPass = verifyHash(password, stored.passwordHash);
    return okEmail && okPass;
  }
  // nothing saved from the panel yet: use .env
  const envE = process.env.ADMIN_EMAIL;
  const envP = process.env.ADMIN_PASSWORD;
  if (!envE || !envP) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  const okEmail = same(e, envE.trim().toLowerCase());
  const okPass = same(password, envP);
  return okEmail && okPass;
}

// export function checkCredentials(email: string, password: string) {
//   const e = process.env.ADMIN_EMAIL;
//   const p = process.env.ADMIN_PASSWORD;
//   if (!e || !p) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
//   // Evaluate both so timing doesn't reveal which one was wrong.
//   const okEmail = same(email.trim().toLowerCase(), e.trim().toLowerCase());
//   const okPass = same(password, p);
//   return okEmail && okPass;
// }

export async function getAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE)?.value);
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
