import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET não definido no .env.local");
  return new TextEncoder().encode(s);
}

const COOKIE = "koa_admin";

export async function signAdminToken() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
  return token;
}

export async function verifyAdminToken(token: string) {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  return (await verifyAdminToken(token)) ? true : null;
}

export function adminCredentialsValid(email: string, password: string) {
  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;
  if (!validEmail || !validPassword) return false;
  // Constant-time comparison to prevent timing attacks
  const emailMatch = timingSafeStringEqual(email, validEmail);
  const passMatch = timingSafeStringEqual(password, validPassword);
  return emailMatch && passMatch;
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a.padEnd(256).slice(0, 256));
  const bufB = Buffer.from(b.padEnd(256).slice(0, 256));
  const equal =
    require("crypto").timingSafeEqual(bufA, bufB) && a.length === b.length;
  return equal;
}

export { COOKIE };
