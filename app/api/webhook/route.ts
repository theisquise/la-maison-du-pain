import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

// Ce webhook est appelé par Stripe après chaque paiement
// Configurez-le dans : https://dashboard.stripe.com/webhooks
// URL : https://votresite.com/api/webhook
// Événements à écouter : checkout.session.completed, payment_intent.succeeded

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[WEBHOOK] Commande confirmée:", session.id);

      // ============================================================
      // PERSONNALISEZ ICI vos actions post-paiement :
      //
      // 1. Envoyer un email de confirmation (avec Resend, Nodemailer...)
      // 2. Envoyer les liens de téléchargement pour les ebooks
      // 3. Créer l'accès à la formation dans votre base de données
      // 4. Notifier votre équipe
      //
      // Exemple d'accès aux données de la commande :
      // const customerEmail = session.customer_details?.email;
      // const items = JSON.parse(session.metadata?.items || "[]");
      // ============================================================

      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.error("[WEBHOOK] Paiement échoué:", intent.id);
      break;
    }
    default:
      console.log("[WEBHOOK] Événement non géré:", event.type);
  }

  return NextResponse.json({ received: true });
}
