import { NextRequest } from "next/server";
import { publicCorsHeaders, publicJson } from "@/lib/http";
import { listPublicMenu } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try { return publicJson(request, { success: true, items: await listPublicMenu() }); }
  catch { return publicJson(request, { success: false, error: "Menu is currently unavailable." }, 503); }
}

export function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: publicCorsHeaders(request) });
}
