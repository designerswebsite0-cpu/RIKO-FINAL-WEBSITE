import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { reservationCounters } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  try { return jsonSuccess({ counters: await reservationCounters() }); }
  catch (error) { return jsonError(error instanceof Error ? error.message : "Unable to load counters.", 503); }
}
