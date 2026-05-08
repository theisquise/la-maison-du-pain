import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/newsletter-data";
import { sendNewsletterWelcome } from "@/lib/resend";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.boulangerie-alex.com";

export async function POST(req: NextRequest) {
  let email: string;

  try {
    const body = await req.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const { subscriber, alreadyExists } = addSubscriber(email.toLowerCase().trim());

  if (!alreadyExists) {
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;
    try {
      await sendNewsletterWelcome({ to: email, unsubscribeUrl });
    } catch (err) {
      console.error("[newsletter] email welcome failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
