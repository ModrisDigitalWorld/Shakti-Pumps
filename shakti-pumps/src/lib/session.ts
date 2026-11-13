// Edge-safe (used by middleware) admin session helpers built on jose.
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "sp_admin";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

function key() {
  const s = process.env.AUTH_SECRET;
  return s && s.length >= 32 ? new TextEncoder().encode(s) : null;
}

export async function createSessionToken(email: string) {
  const k = key();
  if (!k) throw new Error("AUTH_SECRET must be set to a random string of 32+ characters");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(k);
}

export async function verifySessionToken(token?: string | null): Promise<string | null> {
  const k = key();
  if (!token || !k) return null;
  try {
    const { payload } = await jwtVerify(token, k, { algorithms: ["HS256"] });
    return payload.role === "admin" ? (payload.sub ?? null) : null;
  } catch {
    return null;
  }
}
