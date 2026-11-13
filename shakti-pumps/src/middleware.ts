import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verifySessionToken } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // CSRF defence-in-depth: state-changing API calls must come from our own origin.
  if (isApi && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    if (origin) {
      let ok = false;
      try {
        ok = new URL(origin).host === host;
      } catch {}
      if (!ok) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
    }
  }

  if (pathname === "/admin/login" || pathname === "/api/admin/login") return NextResponse.next();

  const admin = await verifySessionToken(req.cookies.get(COOKIE)?.value);
  if (!admin) {
    if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
