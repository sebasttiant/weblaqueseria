import { SignJWT, jwtVerify } from "jose";
import { getAuthSecret } from "@/lib/config/env";

export const SESSION_COOKIE = "lq_session";

const ALGORITHM = "HS256";
const EXPIRATION = "7d";

export interface SessionPayload {
  sub: string;
  email: string;
  role: string;
}

export interface SessionClaims extends SessionPayload {
  iat: number;
  exp: number;
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

/**
 * Sign a session JWT (HS256, 7-day expiry).
 */
export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(EXPIRATION)
    .sign(getSecretKey());
}

/**
 * Verify a session JWT. Edge-safe. Returns null on any failure, never throws.
 */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: [ALGORITHM],
    });

    const { sub, email, role, iat, exp } = payload as Record<string, unknown>;
    if (
      typeof sub !== "string" ||
      typeof email !== "string" ||
      typeof role !== "string" ||
      typeof iat !== "number" ||
      typeof exp !== "number"
    ) {
      return null;
    }

    return { sub, email, role, iat, exp };
  } catch {
    return null;
  }
}
