import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken, createSessionToken, CUSTOMER_COOKIE } from "@/lib/customer-auth";
import { SITE_URL } from "@/lib/resend";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/mon-compte/connexion?error=lien-invalide`);
  }

  const customerId = verifyMagicLinkToken(token);
  if (!customerId) {
    return NextResponse.redirect(`${SITE_URL}/mon-compte/connexion?error=lien-expire`);
  }

  const sessionToken = createSessionToken(customerId);
  const res = NextResponse.redirect(`${SITE_URL}/mon-compte`);
  res.cookies.set(CUSTOMER_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  });
  return res;
}
