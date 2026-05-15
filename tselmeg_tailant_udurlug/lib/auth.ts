import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { redirect } from "next/navigation";

const COOKIE_NAME = "tselmeg_admin";

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function secret() {
  return process.env.AUTH_SECRET || "dev-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token?: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email: string; exp: number };
  if (!data.email || data.exp < Date.now()) return null;
  return data;
}

export function getAdminSession() {
  return verifySession(cookies().get(COOKIE_NAME)?.value);
}

export function requireAdmin() {
  const session = getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export function setAdminCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}
