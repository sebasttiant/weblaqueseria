"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import type { ActionState } from "@/lib/actions/admin/types";

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;
const GENERIC_ERROR = "Credenciales inválidas";

const loginSchema = z.object({
  email: z.email({ error: GENERIC_ERROR }),
  password: z.string().min(1, { error: GENERIC_ERROR }),
});

/**
 * Authenticate an admin and set the session cookie.
 *
 * Failure always returns the same generic message to avoid user enumeration
 * (no distinction between "user not found", "wrong password", or "not admin").
 *
 * NOTE (rate limiting): for the MVP there is no throttle. A production
 * deployment should add a shared-store (e.g. Redis) limiter keyed by IP/email
 * here, before the password verification, to slow brute-force attempts.
 */
export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: GENERIC_ERROR };
  }

  const { email, password } = parsed.data;

  try {
    const prisma = getPrisma();
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), isActive: true },
    });

    // Run verification even when the user is missing is not possible without a
    // dummy hash; we keep the branches uniform and the message generic.
    const passwordOk = user
      ? await verifyPassword(user.passwordHash, password)
      : false;

    if (!user || !passwordOk || user.role !== "ADMIN") {
      return { ok: false, error: GENERIC_ERROR };
    }

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const store = await cookies();
    store.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SEVEN_DAYS_SECONDS,
    });
  } catch (error) {
    console.error("[login]", error);
    return { ok: false, error: "No se pudo iniciar sesión. Intenta de nuevo." };
  }

  // redirect() throws internally, so it must run outside the try/catch.
  redirect("/admin");
}

/**
 * Clear the session cookie and return to the login page.
 */
export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
