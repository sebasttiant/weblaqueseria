import { Prisma } from "@prisma/client";

/**
 * True when the error is a unique-constraint violation (P2002), e.g. a
 * duplicate slug.
 */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/**
 * True when the error is a foreign-key / required-relation violation
 * (P2003 or P2014), e.g. deleting a category that still has products under
 * an onDelete: Restrict relation.
 */
export function isRestrictViolationError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2003" || error.code === "P2014")
  );
}
