import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { createMenuItem, listMenu } from "@/lib/repository";
import { menuItemSchema, zodFields } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { searchParams } = new URL(request.url);
  try {
    const result = await listMenu({
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: Number(searchParams.get("page") ?? 1),
      perPage: Number(searchParams.get("perPage") ?? 20),
    });
    return jsonSuccess(result);
  } catch (error) { return jsonError(error instanceof Error ? error.message : "Unable to load menu.", 503); }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const parsed = menuItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Validation failed.", 400, zodFields(parsed.error));
  try { return jsonSuccess({ item: await createMenuItem(parsed.data) }, 201); }
  catch (error) { return jsonError(error instanceof Error ? error.message : "Unable to create menu item.", 503); }
}
