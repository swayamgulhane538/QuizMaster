import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "@/lib/db";
import { Profile } from "@/types/database";

const SESSION_SECRET = process.env.AUTH_SECRET || "quizmaster-session-signing-secret-2026";
const COOKIE_NAME = "quizmaster_session";

interface SessionPayload {
  userId: string;
  mobile: string;
  role: string;
  expires: number;
}

export function signSession(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }
    const payload: SessionPayload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (payload.expires < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<Profile | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie) return null;

    const session = verifySession(sessionCookie.value);
    if (!session) return null;

    return await db.getProfileById(session.userId);
  } catch (err) {
    return null;
  }
}

export async function createSessionCookie(profile: Profile) {
  const cookieStore = await cookies();
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const token = signSession({
    userId: profile.id,
    mobile: profile.mobile,
    role: profile.role || "student",
    expires: Date.now() + maxAge * 1000,
  });

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
