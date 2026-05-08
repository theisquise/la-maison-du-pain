import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { updateOrderStatus, getCustomerById } from "@/lib/customer-data";
import { sendShippingNotification, sendDeliveryNotification } from "@/lib/resend";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const err = requireAdmin();
  if (err) return err;

  const body = await req.json() as {
    status?: "paid" | "shipped" | "delivered";
    trackingNumber?: string;
  };

  if (!body.status || !["paid", "shipped", "delivered"].includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const updated = updateOrderStatus(params.id, body.status, body.trackingNumber);
  if (!updated) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  // Envoyer l'email uniquement pour les commandes avec produits physiques
  const hasPhysical = updated.items.some((i) => i.type === "product");
  if (hasPhysical) {
    const customer = getCustomerById(updated.customerId);
    if (customer?.email) {
      try {
        if (body.status === "shipped") {
          await sendShippingNotification({
            to: customer.email,
            customerName: customer.name,
            orderRef: updated.stripeSessionId,
            items: updated.items,
            total: updated.totalAmount,
            trackingNumber: updated.trackingNumber,
          });
        } else if (body.status === "delivered") {
          await sendDeliveryNotification({
            to: customer.email,
            customerName: customer.name,
            orderRef: updated.stripeSessionId,
          });
        }
      } catch (emailErr) {
        console.error("[COMMANDES] Erreur envoi email:", emailErr);
        // Ne pas bloquer la réponse si l'email échoue
      }
    }
  }

  return NextResponse.json(updated);
}
