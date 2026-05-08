import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY manquant dans .env.local — les paiements ne fonctionneront pas.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2023-10-16",
  typescript: true,
});

export type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  type: "product" | "formation" | "ebook";
  stripeProductId?: string;
};

export async function createCheckoutSession(
  items: CheckoutItem[],
  siteUrl: string,
  promoDiscount?: { code: string; pct: number; email?: string }
) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
        metadata: { type: item.type },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  // Calcule les réductions pack (en centimes)
  const ebookItems = items.filter((i) => i.type === "ebook");
  const ebookCount = ebookItems.reduce((s, i) => s + i.quantity, 0);
  const ebookDiscountPct = ebookCount >= 3 ? 20 : ebookCount >= 2 ? 10 : 0;
  const ebookDiscountCents = ebookDiscountPct > 0
    ? Math.round(ebookItems.reduce((s, i) => s + Math.round(i.price * 100) * i.quantity, 0) * ebookDiscountPct / 100)
    : 0;

  const formationItems = items.filter((i) => i.type === "formation");
  const formationCount = formationItems.reduce((s, i) => s + i.quantity, 0);
  const formationDiscountPct = formationCount >= 2 ? 10 : 0;
  const formationDiscountCents = formationDiscountPct > 0
    ? Math.round(formationItems.reduce((s, i) => s + Math.round(i.price * 100) * i.quantity, 0) * formationDiscountPct / 100)
    : 0;

  const totalPackDiscountCents = ebookDiscountCents + formationDiscountCents;

  // Applique les réductions via coupon Stripe (API officielle, pas de unit_amount négatif)
  let couponId: string | undefined;

  if (totalPackDiscountCents > 0) {
    // Réduction pack : montant fixe en euros
    const parts: string[] = [];
    if (ebookDiscountPct > 0) parts.push(`pack ebooks −${ebookDiscountPct}%`);
    if (formationDiscountPct > 0) parts.push(`pack formations −${formationDiscountPct}%`);
    const coupon = await stripe.coupons.create({
      amount_off: totalPackDiscountCents,
      currency: "eur",
      duration: "once",
      name: `Réduction ${parts.join(" + ")}`,
    });
    couponId = coupon.id;
  } else if (promoDiscount) {
    // Code promo : pourcentage sur le sous-total
    const coupon = await stripe.coupons.create({
      percent_off: promoDiscount.pct,
      duration: "once",
      name: `Code promo ${promoDiscount.code} (−${promoDiscount.pct}%)`,
    });
    couponId = coupon.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
    success_url: `${siteUrl}/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/panier`,
    billing_address_collection: "auto",
    shipping_address_collection: {
      allowed_countries: ["FR", "BE", "CH", "LU", "CA"],
    },
    phone_number_collection: { enabled: true },
    metadata: {
      items: JSON.stringify(items.map((i) => ({ id: i.id, type: i.type }))),
      ...(promoDiscount ? { promoCode: promoDiscount.code, promoEmail: promoDiscount.email ?? "" } : {}),
    },
  });

  return session;
}
