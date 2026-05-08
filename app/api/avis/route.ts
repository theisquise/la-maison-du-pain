import { NextRequest, NextResponse } from "next/server";
import { getTestimonials, saveTestimonials } from "@/lib/admin-data";

const ipWindow = new Map<string, { count: number; windowStart: number }>();
const MAX_PER_WINDOW = 2;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  const entry = ipWindow.get(ip);

  if (entry) {
    if (now - entry.windowStart < WINDOW_MS) {
      if (entry.count >= MAX_PER_WINDOW) {
        return NextResponse.json({ error: "Trop d'avis envoyés, réessayez plus tard." }, { status: 429 });
      }
      entry.count++;
    } else {
      ipWindow.set(ip, { count: 1, windowStart: now });
    }
  } else {
    ipWindow.set(ip, { count: 1, windowStart: now });
  }

  const body = await req.json() as {
    name?: string;
    text?: string;
    rating?: number;
    product?: string;
  };

  if (!body.name?.trim() || !body.text?.trim()) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));

  const data = getTestimonials();
  data.testimonials.push({
    id: Date.now().toString(),
    name: body.name.trim(),
    text: body.text.trim(),
    rating,
    product: body.product?.trim() || undefined,
    date: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
    pending: true,
  });
  saveTestimonials(data);

  return NextResponse.json({ ok: true });
}
