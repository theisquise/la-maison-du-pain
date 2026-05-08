import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getPromoCodes, addPromoCode, deletePromoCode, togglePromoCode } from "@/lib/promo-data";

export async function GET() {
  const err = requireAdmin();
  if (err) return err;
  return NextResponse.json({ codes: getPromoCodes() });
}

export async function POST(req: NextRequest) {
  const err = requireAdmin();
  if (err) return err;
  const body = await req.json();
  if (!body.code || !body.discountPct) {
    return NextResponse.json({ error: "Code et remise requis." }, { status: 400 });
  }
  addPromoCode({ code: body.code, discountPct: Number(body.discountPct), description: body.description ?? "", active: true });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const err = requireAdmin();
  if (err) return err;
  const { code, active } = await req.json();
  togglePromoCode(code, active);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const err = requireAdmin();
  if (err) return err;
  const { code } = await req.json();
  deletePromoCode(code);
  return NextResponse.json({ ok: true });
}
