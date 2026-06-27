import { NextResponse } from "next/server";

export const jsonError = (error: string, status = 400, fields?: Record<string, string>) =>
  NextResponse.json({ success: false, error, ...(fields ? { fields } : {}) }, { status });

export const jsonSuccess = <T>(payload: T, status = 200) =>
  NextResponse.json({ success: true, ...payload }, { status });

export function getClientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

export function publicCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  const allowed = (process.env.CORS_ORIGINS ?? "").split(",").map((entry) => entry.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export function publicJson<T>(request: Request, body: T, status = 200) {
  return NextResponse.json(body, { status, headers: publicCorsHeaders(request) });
}
