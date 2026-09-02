import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Session handling for the admin portal.
 *
 * This is a single shared operator password, which is the right weight for an
 * internal price editor used by a small team — but be clear about the limits:
 * there is no per-user identity, so an edit cannot be attributed to a person,
 * and rotating access means changing the password for everybody. Move to real
 * accounts before more than a handful of people have the credential.
 *
 * The cookie holds an HMAC of its own expiry, signed with ADMIN_SESSION_SECRET,
 * so it cannot be forged client-side. It is httpOnly and sameSite=lax to keep
 * it away from scripts and cross-site form posts.
 */

const COOKIE_NAME = "cbk_admin";
const SESSION_HOURS = 12;

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET?.trim() || null;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim() && secret());
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

/** Constant-time compare, so a wrong guess leaks nothing through timing. */
function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export async function createSession(): Promise<void> {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not configured");

  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const token = `${expiresAt}.${sign(String(expiresAt), key)}`;

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isSignedIn(): Promise<boolean> {
  const key = secret();
  if (!key) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;
  if (Number(expiry) < Date.now()) return false;

  return safeEqual(signature, sign(expiry, key));
}

/**
 * Guard for server actions. Every mutating action calls this itself rather than
 * relying on the page that rendered the form, because a server action is a
 * public endpoint that can be invoked directly.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isSignedIn())) {
    throw new Error("Not authorised");
  }
}
