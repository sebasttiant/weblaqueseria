import { z } from "zod";

/**
 * Environment validation.
 *
 * Public, build-safe variables are validated eagerly at module load so a
 * misconfigured deployment fails fast. Server-only secrets (AUTH_SECRET) are
 * resolved lazily through getters so that `next build` collection does not
 * crash when the secret is absent in a build-only environment.
 */

const publicEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, { error: "DATABASE_URL is required" }),
  NEXT_PUBLIC_SITE_URL: z.string().min(1).default("http://localhost:3000"),
});

type PublicEnv = z.infer<typeof publicEnvSchema>;

function loadPublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env["DATABASE_URL"],
    NEXT_PUBLIC_SITE_URL: process.env["NEXT_PUBLIC_SITE_URL"],
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${issues}`);
  }

  return parsed.data;
}

export const env: PublicEnv = loadPublicEnv();

const authSecretSchema = z
  .string()
  .min(32, { error: "AUTH_SECRET must be at least 32 characters" });

/**
 * Resolve the server-only auth secret. Throws on first use if absent or
 * too short. Never call this during build-time collection of static pages.
 */
export function getAuthSecret(): string {
  const parsed = authSecretSchema.safeParse(process.env["AUTH_SECRET"]);
  if (!parsed.success) {
    throw new Error(
      "AUTH_SECRET is not set or is too short (min 32 characters).",
    );
  }
  return parsed.data;
}
