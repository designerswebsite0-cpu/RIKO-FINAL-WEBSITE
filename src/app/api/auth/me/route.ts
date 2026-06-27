import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonSuccess } from "@/lib/http";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  return unauthorized ?? jsonSuccess({ authenticated: true });
}
