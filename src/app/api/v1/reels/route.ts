import { NextRequest } from "next/server";
import { publicCorsHeaders, publicJson } from "@/lib/http";
import { listReels } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const reels = await listReels();
    return publicJson(request, { success: true, items: reels });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reels are currently unavailable.";
    return publicJson(request, { success: false, error: message }, 503);
  }
}

export function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: publicCorsHeaders(request) });
}
