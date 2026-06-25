import { hash, verify } from "@node-rs/argon2";

/**
 * Hash a plaintext password using argon2id defaults.
 */
export async function hashPassword(plain: string): Promise<string> {
  return hash(plain);
}

/**
 * Verify a plaintext password against a stored argon2 hash.
 * Returns false on any verification failure rather than throwing.
 */
export async function verifyPassword(
  hashValue: string,
  plain: string,
): Promise<boolean> {
  try {
    return await verify(hashValue, plain);
  } catch {
    return false;
  }
}
