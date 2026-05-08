import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo-data";
import { findSubscriber } from "@/lib/newsletter-data";

export async function POST(req: NextRequest) {
  const { code, email } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, error: "Code invalide." });
  }

  const promo = validatePromoCode(code);
  if (!promo) {
    return NextResponse.json({ valid: false, error: "Code introuvable ou expiré." });
  }

  // Vérifie abonnement newsletter si requis
  if (promo.requiresNewsletter) {
    if (!email || typeof email !== "string") {
      return NextResponse.json({ valid: false, needsEmail: true, error: "Entrez votre email newsletter pour activer ce code." });
    }
    const subscriber = findSubscriber(email);
    if (!subscriber) {
      return NextResponse.json({ valid: false, error: "Cet email n'est pas abonné à notre newsletter." });
    }
  }

  // Vérifie usage unique
  if (promo.oneTimeUse && email) {
    const normalized = email.toLowerCase().trim();
    if (promo.usedEmails?.includes(normalized)) {
      return NextResponse.json({ valid: false, error: "Ce code a déjà été utilisé avec cet email." });
    }
  }

  return NextResponse.json({
    valid: true,
    discountPct: promo.discountPct,
    description: promo.description,
    requiresNewsletter: promo.requiresNewsletter,
    oneTimeUse: promo.oneTimeUse,
  });
}
