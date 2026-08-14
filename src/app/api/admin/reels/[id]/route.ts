import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { deleteReel, getReel, updateReel } from "@/lib/repository";
import { reelPatchSchema, zodFields } from "@/lib/validation";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const item = await getReel((await params).id);
  return item ? jsonSuccess({ success: true, item }) : jsonError("Reel not found.", 404);
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const parsed = reelPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("Validation failed.", 400, zodFields(parsed.error));
  }

  try {
    const item = await updateReel((await params).id, parsed.data);
    return item ? jsonSuccess({ success: true, item }) : jsonError("Reel not found.", 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update reel.";
    return jsonError(message, 503);
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const success = await deleteReel((await params).id);
    return success ? jsonSuccess({ success: true }) : jsonError("Reel not found.", 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete reel.";
    return jsonError(message, 503);
  }
}
