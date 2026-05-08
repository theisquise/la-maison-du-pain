import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { updateOrderStatus } from "@/lib/customer-data";

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

  return NextResponse.json(updated);
}
