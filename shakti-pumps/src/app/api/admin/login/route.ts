import { NextResponse } from "next/server";
import { z } from "zod";
import { checkCredentials } from "@/lib/auth";
import { COOKIE, SESSION_SECONDS, createSessionToken } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const body = z.object({ email: z.string().min(1).max(200), password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });

  let ok = false;
  let token = "";
  try {
  ok = await checkCredentials(parsed.data.email, parsed.data.password);
    if (ok) token = await createSessionToken(parsed.data.email.trim().toLowerCase());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
  if (!ok) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}
