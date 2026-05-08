import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/customer-data";
import { createMagicLink } from "@/lib/customer-auth";
import { sendMagicLink } from "@/lib/resend";

const MAX_PER_WINDOW = 5
const WINDOW_MS = 10 * 60 * 1000 // 5 attempts per 10 minutes per IP

const ipWindow = new Map<string, { count: number; windowStart: number }>()

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const now = Date.now()
  const rec = ipWindow.get(ip) ?? { count: 0, windowStart: now }

  if (now - rec.windowStart > WINDOW_MS) {
    rec.count = 0
    rec.windowStart = now
  }
  rec.count += 1
  ipWindow.set(ip, rec)

  if (rec.count > MAX_PER_WINDOW) {
    return NextResponse.json({ ok: true }) // Silent — don't reveal rate limiting
  }

  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const customer = getCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json({ ok: true });
    }

    const magicLink = createMagicLink(customer.id);
    await sendMagicLink({ to: email, magicLink });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[magic-link]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
