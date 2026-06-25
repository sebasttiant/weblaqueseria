import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  verifySessionToken,
  type SessionClaims,
} from "@/lib/auth/session";

const ADMIN_ROLE = "ADMIN";

/**
 * Read and verify the session cookie. Returns the decoded claims or null.
 * Never throws — safe to call from any server context.
 */
export async function getSessionClaims(): Promise<SessionClaims | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Guard for admin-only server code (layouts, pages, server actions).
 * Returns the claims when the caller is an authenticated ADMIN, otherwise
 * redirects to the login page. This is defense in depth: middleware already
 * gates routing, but every privileged server action must call this too and
 * never trust the middleware alone.
 */
export async function requireAdmin(): Promise<SessionClaims> {
  const claims = await getSessionClaims();
  if (!claims || claims.role !== ADMIN_ROLE) {
    redirect("/admin/login");
  }
  return claims;
}
