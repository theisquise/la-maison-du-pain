import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "session_id manquant" }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const items = JSON.parse(session.metadata?.items || "[]") as { id: string; type: string }[];
    const types = Array.from(new Set(items.map((i) => i.type)));
    return NextResponse.json({ types });
  } catch {
    return NextResponse.json({ types: ["product"] });
  }
}
