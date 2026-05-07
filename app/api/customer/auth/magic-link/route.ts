import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/customer-data";
import { createMagicLink } from "@/lib/customer-auth";
import { sendMagicLink } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const customer = getCustomerByEmail(email);
    if (!customer) {
      // Ne pas révéler si l'email existe ou non
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
