import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

const LOGIN_PATH = "/admin/login";
const ADMIN_ROLE = "ADMIN";

/**
 * Edge middleware that gates the /admin area.
 *
 * It only verifies the signed session JWT with jose (edge-safe) — it never
 * touches Prisma or any Node-only API. The login route is always allowed
 * through so an unauthenticated user can reach the form. This is the first
 * layer of defense; server layouts/actions re-check via requireAdmin().
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const claims = await verifySessionToken(token);

  if (!claims || claims.role !== ADMIN_ROLE) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match every /admin route. Static assets and _next internals are excluded
  // because they never live under /admin.
  matcher: ["/admin/:path*"],
};
