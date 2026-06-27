import { NextRequest } from "next/server";
import { getClientIp, publicCorsHeaders, publicJson } from "@/lib/http";
import { createReservation } from "@/lib/repository";
import { recordReservation, reservationRateLimited } from "@/lib/rate-limit";
import { reservationCreateSchema, zodFields } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (reservationRateLimited(ip)) return publicJson(request, { success: false, error: "Please wait 30 seconds before submitting another reservation." }, 429);
  const parsed = reservationCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return publicJson(request, { success: false, error: "Validation failed.", fields: zodFields(parsed.error) }, 400);
  try {
    const item = await createReservation(parsed.data);
    recordReservation(ip);
    return publicJson(request, { success: true, item }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save reservation.";
    return publicJson(request, { success: false, error: message }, message.includes("already exists") ? 409 : 503);
  }
}

export function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: publicCorsHeaders(request) });
}
