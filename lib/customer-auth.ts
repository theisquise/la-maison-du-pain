import crypto from "crypto";
import { saveMagicLink, consumeMagicLink, getCustomerById } from "./customer-data";
import { SITE_URL } from "./resend";

export const CUSTOMER_COOKIE = "customer_token";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours
const MAGIC_LINK_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getSecret(): string {
  return process.env.CUSTOMER_SECRET ?? "customer-secret-change-me";
}

// ─── Session cookie (30 jours) ────────────────────────────────────────────────

export function createSessionToken(customerId: string): string {
  const payload = JSON.stringify({ customerId, exp: Date.now() + SESSION_TTL_MS });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [b64, sig] = parts;
    const expectedSig = crypto.createHmac("sha256", getSecret()).update(b64).digest("base64url");
    const sigBuf = Buffer.from(sig, "base64url");
    const expBuf = Buffer.from(expectedSig, "base64url");
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf-8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload.customerId as string;
  } catch {
    return null;
  }
}

// ─── Magic link (lien email 30 min, usage unique) ─────────────────────────────

export function createMagicLink(customerId: string): string {
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = JSON.stringify({ customerId, nonce, exp: Date.now() + MAGIC_LINK_TTL_MS });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(b64).digest("base64url");
  const token = `${b64}.${sig}`;

  saveMagicLink({
    token,
    customerId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_MS).toISOString(),
    usedAt: null,
  });

  return `${SITE_URL}/api/customer/auth/verify?token=${encodeURIComponent(token)}`;
}

export function verifyMagicLinkToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [b64, sig] = parts;
    const expectedSig = crypto.createHmac("sha256", getSecret()).update(b64).digest("base64url");
    const sigBuf = Buffer.from(sig, "base64url");
    const expBuf = Buffer.from(expectedSig, "base64url");
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf-8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    // Consume from DB (one-time use)
    const link = consumeMagicLink(token);
    if (!link) return null;
    return payload.customerId as string;
  } catch {
    return null;
  }
}

// ─── Guard (server-side) ──────────────────────────────────────────────────────

export async function getCustomerFromCookie(
  cookieValue: string | undefined
): Promise<ReturnType<typeof getCustomerById>> {
  if (!cookieValue) return undefined;
  const customerId = verifySessionToken(cookieValue);
  if (!customerId) return undefined;
  return getCustomerById(customerId);
}
