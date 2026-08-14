import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { createReel, listReels } from "@/lib/repository";
import { reelSchema, zodFields } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    const reels = await listReels();
    return jsonSuccess({ success: true, items: reels });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load reels.";
    return jsonError(message, 503);
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const parsed = reelSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("Validation failed.", 400, zodFields(parsed.error));
  }

  try {
    const item = await createReel(parsed.data);
    return jsonSuccess({ success: true, item }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create reel.";
    return jsonError(message, 503);
  }
}
