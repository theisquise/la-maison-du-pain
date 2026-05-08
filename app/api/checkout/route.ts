import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import type { CheckoutItem } from "@/lib/stripe";
import { validatePromoCode } from "@/lib/promo-data";

export async function POST(req: NextRequest) {
  try {
    const { items, promoCode } = await req.json() as { items: CheckoutItem[]; promoCode?: string };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.get("host")}`;

    // Valide le code promo côté serveur
    let promoDiscount: { code: string; pct: number } | undefined;
    if (promoCode) {
      const promo = validatePromoCode(promoCode);
      if (promo) {
        // Non cumulable : on n'applique que si pas de pack discount
        const hasPackDiscount = (() => {
          const ebookCount = items.filter(i => i.type === "ebook").reduce((s, i) => s + i.quantity, 0);
          const formationCount = items.filter(i => i.type === "formation").reduce((s, i) => s + i.quantity, 0);
          return ebookCount >= 2 || formationCount >= 2;
        })();
        if (!hasPackDiscount) {
          promoDiscount = { code: promo.code, pct: promo.discountPct };
        }
      }
    }

    const session = await createCheckoutSession(items, siteUrl, promoDiscount);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    console.error("[CHECKOUT ERROR]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
