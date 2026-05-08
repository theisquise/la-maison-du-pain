import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo-data";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, error: "Code invalide." });
  }
  const promo = validatePromoCode(code);
  if (!promo) {
    return NextResponse.json({ valid: false, error: "Code introuvable ou expiré." });
  }
  return NextResponse.json({ valid: true, discountPct: promo.discountPct, description: promo.description });
}
