import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Health probe. Always returns 200 when the app process is up. Pings the
 * database lightly; if the DB is unreachable it reports 503 with db: "down"
 * but never throws so the container stays observable.
 */
export async function GET() {
  const ts = new Date().toISOString();

  let dbOk = false;
  try {
    await getPrisma().$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json(
    { status: "ok", db: dbOk ? "up" : "down", ts },
    { status: dbOk ? 200 : 503 },
  );
}
