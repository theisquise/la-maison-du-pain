import { NextResponse } from "next/server";
import { getAllCustomers, getAllOrders } from "@/lib/customer-data";

export async function GET() {
  const customers = getAllCustomers();
  const orders = getAllOrders();
  return NextResponse.json({ customers, orders });
}
