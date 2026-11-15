import { NextResponse } from "next/server";
import { z } from "zod";
import { checkCredentials, getAdmin, saveAdmin } from "@/lib/auth";
import { COOKIE, SESSION_SECONDS, createSessionToken } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const body = z.object({
  currentPassword: z.string().min(1).max(200),
  newEmail: z.string().trim().max(200).optional(),
  newPassword: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const current = await getAdmin();
  if (!current) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!rateLimit(`account:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter your current password." }, { status: 400 });

  const newEmail = (parsed.data.newEmail ?? "").trim().toLowerCase();
  const newPassword = parsed.data.newPassword ?? "";
  if (!newEmail && !newPassword) return NextResponse.json({ error: "Enter a new email or a new password." }, { status: 400 });
  if (newEmail && !z.email().safeParse(newEmail).success) return NextResponse.json({ error: "That email address is not valid." }, { status: 400 });
  if (newPassword && newPassword.length < 10) return NextResponse.json({ error: "New password must be at least 10 characters." }, { status: 400 });

  try {
    if (!(await checkCredentials(current, parsed.data.currentPassword))) {
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    const email = newEmail || current;
    await saveAdmin(email, newPassword || parsed.data.currentPassword);
    const token = await createSessionToken(email);
    const res = NextResponse.json({ ok: true, email });
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_SECONDS,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}