import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { deleteMenuItem, getMenuItem, updateMenuItem } from "@/lib/repository";
import { menuPatchSchema, zodFields } from "@/lib/validation";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const item = await getMenuItem((await params).id);
  return item ? jsonSuccess({ item }) : jsonError("Menu item not found.", 404);
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const parsed = menuPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Validation failed.", 400, zodFields(parsed.error));
  try {
    const item = await updateMenuItem((await params).id, parsed.data);
    return item ? jsonSuccess({ item }) : jsonError("Menu item not found.", 404);
  } catch (error) { return jsonError(error instanceof Error ? error.message : "Unable to update menu item.", 503); }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  try { return (await deleteMenuItem((await params).id)) ? jsonSuccess({}) : jsonError("Menu item not found.", 404); }
  catch (error) { return jsonError(error instanceof Error ? error.message : "Unable to delete menu item.", 503); }
}
