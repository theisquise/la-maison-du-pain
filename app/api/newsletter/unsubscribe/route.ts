import { NextRequest, NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/newsletter-data";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const ok = unsubscribeByToken(token);

  const message = ok
    ? "Vous avez été désabonné(e) avec succès. Vous ne recevrez plus de newsletter."
    : "Ce lien de désabonnement est invalide ou a déjà été utilisé.";

  return new NextResponse(
    `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Désabonnement — La Maison du Pain</title><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f4;}div{text-align:center;max-width:400px;padding:40px;}h1{font-size:1.5rem;margin-bottom:12px;}p{color:#666;margin-bottom:24px;}a{color:#1c1917;font-weight:600;}</style></head><body><div><h1>${ok ? "✅ Désabonnement confirmé" : "⚠️ Lien invalide"}</h1><p>${message}</p><a href="/">← Retour au site</a></div></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
