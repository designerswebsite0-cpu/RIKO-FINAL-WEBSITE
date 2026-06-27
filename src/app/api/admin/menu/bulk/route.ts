import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { bulkMenuAction } from "@/lib/repository";

const schema = z.object({ ids: z.array(z.string().min(1)).min(1).max(100), action: z.enum(["publish", "draft", "delete"]) });
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Provide one or more ids and a valid action.");
  try { await bulkMenuAction(parsed.data.ids, parsed.data.action); return jsonSuccess({}); }
  catch (error) { return jsonError(error instanceof Error ? error.message : "Bulk action failed.", 503); }
}
