import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getAllCustomers, getAllOrders } from "@/lib/customer-data";

export async function GET() {
  const err = requireAdmin();
  if (err) return err;
  const customers = getAllCustomers();
  const orders = getAllOrders();
  return NextResponse.json({ customers, orders });
}
