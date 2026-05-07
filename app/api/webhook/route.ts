import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createOrUpdateCustomer, createOrder, orderAlreadyExists } from "@/lib/customer-data";
import { createMagicLink } from "@/lib/customer-auth";
import { sendOrderConfirmation, type OrderItem } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[WEBHOOK] Signature invalide:", err);
    return NextResponse.json({ error: "Webhook invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Idempotence — évite le double traitement si Stripe renvoie l'événement
    if (orderAlreadyExists(session.id)) {
      return NextResponse.json({ received: true });
    }

    try {
      const email = session.customer_details?.email ?? "";
      const name = session.customer_details?.name ?? email.split("@")[0];

      const rawItems = JSON.parse(session.metadata?.items ?? "[]") as {
        id: string;
        name?: string;
        type: "product" | "formation" | "ebook";
        price?: number;
      }[];

      // Enrichir depuis Stripe si les noms/prix ne sont pas dans les métadonnées
      let lineItems: Stripe.LineItem[] = [];
      if (rawItems.some((i) => !i.name)) {
        try {
          const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
          lineItems = li.data;
        } catch {
          // silencieux
        }
      }

      const orderItems: OrderItem[] = rawItems.map((item, idx) => ({
        id: item.id,
        name: item.name ?? lineItems[idx]?.description ?? "Produit",
        type: item.type,
        price: item.price ?? (lineItems[idx]?.amount_total ?? 0) / 100,
      }));

      const totalAmount = (session.amount_total ?? 0) / 100;

      // 1. Créer / mettre à jour le client
      const customer = createOrUpdateCustomer(email, name);

      // 2. Sauvegarder la commande
      createOrder({
        customerId: customer.id,
        stripeSessionId: session.id,
        items: orderItems,
        totalAmount,
        status: "paid",
      });

      // 3. Générer un magic link pour accéder directement à l'espace client
      const magicLink = createMagicLink(customer.id);

      // 4. Envoyer l'email de confirmation
      if (email) {
        await sendOrderConfirmation({
          to: email,
          customerName: name,
          orderRef: session.id,
          items: orderItems,
          total: totalAmount,
          magicLink,
        });
      }

      console.log(`[WEBHOOK] Commande ${session.id} traitée pour ${email}`);
    } catch (err) {
      console.error("[WEBHOOK] Erreur traitement commande:", err);
      // On retourne quand même 200 pour éviter que Stripe ne réessaie inutilement
    }
  }

  return NextResponse.json({ received: true });
}
