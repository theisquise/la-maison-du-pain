import { NextRequest, NextResponse } from "next/server";
import { getCustomerFromCookie, CUSTOMER_COOKIE } from "@/lib/customer-auth";
import { getOrdersByCustomer } from "@/lib/customer-data";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(CUSTOMER_COOKIE)?.value;
  const customer = await getCustomerFromCookie(token);
  if (!customer) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }
  const orders = getOrdersByCustomer(customer.id);
  return NextResponse.json({ customer, orders });
}
