import { NextRequest, NextResponse } from "next/server";
import { adminCookie, createSessionToken, isLoginAllowed, passwordIsCorrect, recordLogin } from "@/lib/auth";
import { getClientIp, jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!isLoginAllowed(ip)) return jsonError("Too many attempts. Try again in 10 minutes.", 429);
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (!body || typeof body.password !== "string") return jsonError("Password is required.");
  if (!passwordIsCorrect(body.password)) { recordLogin(ip, false); return jsonError("Invalid password.", 401); }
  recordLogin(ip, true);
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie(await createSessionToken()));
  return response;
}
