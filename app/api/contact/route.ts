import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { FROM_EMAIL, SITE_NAME, SITE_URL } from "@/lib/resend";
import { getConfig } from "@/lib/admin-data";

const fromDomain = FROM_EMAIL.split("@")[1] ?? "boulangerie-alex.com";
const CONTACT_FROM = `contact@${fromDomain}`;

const ipWindow = new Map<string, { count: number; windowStart: number }>();
const MAX_PER_WINDOW = 3;
const WINDOW_MS = 60 * 60 * 1000;

const SUBJECT_LABELS: Record<string, string> = {
  commande: "Question sur une commande",
  formation: "Informations sur une formation",
  ebook: "Question sur un ebook",
  produit: "Question produit",
  partenariat: "Partenariat",
  autre: "Autre",
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  const entry = ipWindow.get(ip);

  if (entry) {
    if (now - entry.windowStart < WINDOW_MS) {
      if (entry.count >= MAX_PER_WINDOW) {
        return NextResponse.json({ error: "Trop de messages envoyés, réessayez plus tard." }, { status: 429 });
      }
      entry.count++;
    } else {
      ipWindow.set(ip, { count: 1, windowStart: now });
    }
  } else {
    ipWindow.set(ip, { count: 1, windowStart: now });
  }

  const body = await req.json() as { name?: string; email?: string; subject?: string; message?: string };
  const { name, email, subject, message } = body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { siteConfig } = getConfig();
  const adminEmail = process.env.CONTACT_EMAIL ?? siteConfig.contact.email ?? FROM_EMAIL;
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

  try {
    await Promise.all([
      // Email à l'admin
      resend.emails.send({
        from: CONTACT_FROM,
        to: adminEmail,
        replyTo: email,
        subject: `📬 Nouveau message — ${subjectLabel}`,
        html: `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f4;padding:40px 16px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:40px;">
  <h2 style="margin:0 0 24px;color:#1c1917;font-size:20px;">📬 Nouveau message de contact</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 0;color:#78716c;font-size:14px;width:100px;">Nom</td><td style="padding:8px 0;color:#1c1917;font-size:14px;font-weight:600;">${name}</td></tr>
    <tr><td style="padding:8px 0;color:#78716c;font-size:14px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}" style="color:#1c1917;">${email}</a></td></tr>
    <tr><td style="padding:8px 0;color:#78716c;font-size:14px;">Sujet</td><td style="padding:8px 0;color:#1c1917;font-size:14px;">${subjectLabel}</td></tr>
  </table>
  <div style="margin-top:24px;background:#f5f5f4;border-radius:8px;padding:20px;">
    <p style="margin:0;color:#1c1917;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
  </div>
  <p style="margin:24px 0 0;color:#a8a29e;font-size:12px;">Répondez directement à cet email pour contacter ${name}.</p>
</div>
</body></html>`,
      }),
      // Confirmation au visiteur
      resend.emails.send({
        from: CONTACT_FROM,
        to: email,
        subject: `✅ Message bien reçu — ${SITE_NAME}`,
        html: `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f4;padding:40px 16px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
  <div style="background:#1c1917;padding:28px 40px;text-align:center;">
    <p style="margin:0;color:#fbbf24;font-size:18px;font-weight:700;">🍞 ${SITE_NAME}</p>
  </div>
  <div style="padding:40px;">
    <h1 style="margin:0 0 8px;font-size:22px;color:#1c1917;">Message bien reçu !</h1>
    <p style="margin:0 0 24px;color:#78716c;font-size:15px;">Bonjour ${name}, nous avons bien reçu votre message et nous vous répondrons sous 24h.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;color:#166534;font-size:14px;">📋 Sujet : <strong>${subjectLabel}</strong></p>
    </div>
    <a href="${SITE_URL}" style="display:inline-block;background:#1c1917;color:#fff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">Retour au site →</a>
  </div>
  <div style="padding:24px 0;text-align:center;">
    <p style="margin:0;color:#a8a29e;font-size:12px;">© ${new Date().getFullYear()} ${SITE_NAME}</p>
  </div>
</div>
</body></html>`,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CONTACT]", err);
    return NextResponse.json({ error: "Erreur lors de l'envoi, réessayez plus tard." }, { status: 500 });
  }
}
