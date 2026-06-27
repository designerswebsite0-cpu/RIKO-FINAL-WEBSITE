import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { deleteReservation, getReservation, updateReservation } from "@/lib/repository";
import { reservationPatchSchema, zodFields } from "@/lib/validation";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const item = await getReservation((await params).id, true);
  return item ? jsonSuccess({ item }) : jsonError("Reservation not found.", 404);
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const parsed = reservationPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Validation failed.", 400, zodFields(parsed.error));
  try {
    const item = await updateReservation((await params).id, parsed.data);
    return item ? jsonSuccess({ item }) : jsonError("Reservation not found.", 404);
  } catch (error) { return jsonError(error instanceof Error ? error.message : "Unable to update reservation.", 503); }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  try { return (await deleteReservation((await params).id)) ? jsonSuccess({}) : jsonError("Reservation not found.", 404); }
  catch (error) { return jsonError(error instanceof Error ? error.message : "Unable to delete reservation.", 503); }
}
