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

export async function createCheckoutSession(items: CheckoutItem[], siteUrl: string, promoDiscount?: { code: string; pct: number; email?: string }) {
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

  // Réductions pack ebooks
  const ebookItems = items.filter((i) => i.type === "ebook");
  const ebookCount = ebookItems.reduce((sum, i) => sum + i.quantity, 0);
  const ebookDiscountPct = ebookCount >= 3 ? 20 : ebookCount >= 2 ? 10 : 0;
  if (ebookDiscountPct > 0) {
    const ebookTotal = ebookItems.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: `Réduction pack ebooks (${ebookDiscountPct}%)` },
        unit_amount: -Math.round(ebookTotal * ebookDiscountPct / 100),
      },
      quantity: 1,
    });
  }

  // Réductions pack formations
  const formationItems = items.filter((i) => i.type === "formation");
  const formationCount = formationItems.reduce((sum, i) => sum + i.quantity, 0);
  const formationDiscountPct = formationCount >= 2 ? 10 : 0;
  if (formationDiscountPct > 0) {
    const formationTotal = formationItems.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: `Réduction pack formations (${formationDiscountPct}%)` },
        unit_amount: -Math.round(formationTotal * formationDiscountPct / 100),
      },
      quantity: 1,
    });
  }

  // Code promo (non cumulable avec les packs — vérifié côté serveur avant d'arriver ici)
  if (promoDiscount) {
    const subtotal = items.reduce((s, i) => s + Math.round(i.price * 100) * i.quantity, 0);
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: `Code promo ${promoDiscount.code} (−${promoDiscount.pct}%)` },
        unit_amount: -Math.round(subtotal * promoDiscount.pct / 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
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
