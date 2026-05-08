import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getSubscribers, deleteSubscriber } from "@/lib/newsletter-data";

export async function GET() {
  const err = requireAdmin();
  if (err) return err;
  return NextResponse.json({ subscribers: getSubscribers() });
}

export async function DELETE(req: Request) {
  const err = requireAdmin();
  if (err) return err;
  const { id } = await req.json();
  const ok = deleteSubscriber(id);
  return NextResponse.json({ ok });
}
