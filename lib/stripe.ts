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

export async function createCheckoutSession(items: CheckoutItem[], siteUrl: string) {
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
    },
  });

  return session;
}
