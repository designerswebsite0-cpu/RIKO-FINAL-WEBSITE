import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { listReservations } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { searchParams } = new URL(request.url);
  try {
    return jsonSuccess(await listReservations({
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      dateFilter: searchParams.get("dateFilter") ?? undefined,
      startDate: searchParams.get("startDate") ?? undefined,
      endDate: searchParams.get("endDate") ?? undefined,
      page: Number(searchParams.get("page") ?? 1),
      perPage: Number(searchParams.get("perPage") ?? 20),
    }));
  } catch (error) { return jsonError(error instanceof Error ? error.message : "Unable to load reservations.", 503); }
}
