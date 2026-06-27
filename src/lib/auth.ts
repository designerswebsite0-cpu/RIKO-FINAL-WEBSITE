import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { jsonError } from "@/lib/http";

export const ADMIN_COOKIE = "riko_admin_session";
const sessionAgeSeconds = 60 * 60 * 8;
const attempts = new Map<string, { count: number; lockoutUntil: number }>();

function secret() {
  const value = process.env.AUTH_SECRET || "default-development-auth-secret-key-32-chars-long";
  return new TextEncoder().encode(value);
}

function safeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

export function isLoginAllowed(ip: string) {
  const state = attempts.get(ip);
  return !state || state.lockoutUntil <= Date.now();
}

export function recordLogin(ip: string, successful: boolean) {
  if (successful) return attempts.delete(ip);
  const state = attempts.get(ip) ?? { count: 0, lockoutUntil: 0 };
  state.count += 1;
  if (state.count >= 5) state.lockoutUntil = Date.now() + 10 * 60 * 1000;
  attempts.set(ip, state);
}

export function passwordIsCorrect(password: string) {
  const configured = process.env.ADMIN_PASSWORD || "admin";
  return safeEqual(password, configured);
}

export async function createSessionToken() {
  return new SignJWT({ scope: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionAgeSeconds}s`)
    .sign(secret());
}

export async function tokenIsValid(token?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.scope === "admin";
  } catch {
    return false;
  }
}

export function adminCookie(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionAgeSeconds,
  };
}

export async function requireAdmin(request: NextRequest) {
  if (await tokenIsValid(request.cookies.get(ADMIN_COOKIE)?.value)) return null;
  return jsonError("Unauthorized.", 401);
}

export async function requireAdminPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!(await tokenIsValid(token))) redirect("/admin");
}
