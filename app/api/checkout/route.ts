import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import type { CheckoutItem } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json() as { items: CheckoutItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.get("host")}`;

    const session = await createCheckoutSession(items, siteUrl);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    console.error("[CHECKOUT ERROR]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
