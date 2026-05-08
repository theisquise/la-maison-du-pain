import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM ?? "onboarding@resend.dev";
export const SITE_NAME = "La Maison du Pain";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.boulangerie-alex.com";

// ─── Templates ────────────────────────────────────────────────────────────────

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${SITE_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#1c1917;border-radius:12px 12px 0 0;padding:28px 40px;text-align:center;">
            <span style="font-size:28px;">🍞</span>
            <p style="margin:8px 0 0;color:#fbbf24;font-size:18px;font-weight:700;letter-spacing:0.5px;">${SITE_NAME}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 0;text-align:center;">
            <p style="margin:0;color:#a8a29e;font-size:12px;">
              © ${new Date().getFullYear()} ${SITE_NAME} ·
              <a href="${SITE_URL}" style="color:#a8a29e;">boulangerie-alex.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#1c1917;color:#ffffff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;margin:8px 0;">${label} →</a>`;
}

// ─── Email 1 : Confirmation de commande ───────────────────────────────────────

export type OrderItem = { id: string; name: string; type: "product" | "formation" | "ebook"; price: number };

export async function sendOrderConfirmation(opts: {
  to: string;
  customerName: string;
  orderRef: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  magicLink: string;
}) {
  const { to, customerName, orderRef, orderNumber, items, total, magicLink } = opts;

  const hasDigital = items.some((i) => i.type !== "product");
  const hasPhysical = items.some((i) => i.type === "product");

  const itemRows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;font-size:14px;color:#1c1917;">${i.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;font-size:14px;color:#57534e;text-align:right;">${i.price.toFixed(2)} €</td>
        </tr>`
    )
    .join("");

  const content = `
    <div style="display:inline-block;background:#f5f5f4;border-radius:6px;padding:4px 12px;margin-bottom:16px;">
      <span style="font-size:13px;color:#78716c;font-weight:600;">Commande ${orderNumber}</span>
    </div>
    <h1 style="margin:0 0 4px;font-size:24px;color:#1c1917;">Merci pour votre commande&nbsp;!</h1>
    <p style="margin:0 0 24px;color:#78716c;font-size:15px;">Bonjour ${customerName}, votre paiement a bien été reçu.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${itemRows}
      <tr>
        <td style="padding-top:12px;font-weight:700;font-size:15px;color:#1c1917;">Total</td>
        <td style="padding-top:12px;font-weight:700;font-size:15px;color:#1c1917;text-align:right;">${total.toFixed(2)} €</td>
      </tr>
    </table>

    ${
      hasDigital
        ? `<div style="background:#fefce8;border:1px solid #fef08a;border-radius:8px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-weight:600;color:#713f12;font-size:14px;">📥 Vos contenus numériques</p>
        <p style="margin:0 0 16px;color:#854d0e;font-size:13px;">Accédez à votre bibliothèque depuis votre espace client :</p>
        ${btn(magicLink, "Accéder à mes achats")}
      </div>`
        : ""
    }

    ${
      hasPhysical
        ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="margin:0;color:#166534;font-size:13px;">🚚 <strong>Livraison en 24-48h ouvrés</strong> — vous recevrez un email de suivi dès l'expédition.</p>
      </div>`
        : ""
    }

    <p style="margin:0;color:#a8a29e;font-size:12px;">Un problème ? Répondez à cet email ou <a href="${SITE_URL}/contact" style="color:#a8a29e;">contactez-nous</a>.</p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `✅ Commande ${orderNumber} confirmée — ${SITE_NAME}`,
    html: baseLayout(content),
  });
}

// ─── Email 2 : Expédition ─────────────────────────────────────────────────────

export async function sendShippingNotification(opts: {
  to: string;
  customerName: string;
  orderRef: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
}) {
  const { to, customerName, orderNumber, items, total, trackingNumber } = opts;

  const itemRows = items
    .filter((i) => i.type === "product")
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;font-size:14px;color:#1c1917;">${i.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;font-size:14px;color:#57534e;text-align:right;">${i.price.toFixed(2)} €</td>
        </tr>`
    )
    .join("");

  const content = `
    <div style="display:inline-block;background:#f5f5f4;border-radius:6px;padding:4px 12px;margin-bottom:16px;">
      <span style="font-size:13px;color:#78716c;font-weight:600;">Commande ${orderNumber}</span>
    </div>
    <h1 style="margin:0 0 4px;font-size:24px;color:#1c1917;">Votre commande est en route&nbsp;! 🚚</h1>
    <p style="margin:0 0 24px;color:#78716c;font-size:15px;">Bonjour ${customerName}, votre colis vient d'être expédié.</p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-weight:600;color:#166534;font-size:14px;">📦 Colis expédié</p>
      <p style="margin:0;color:#166534;font-size:13px;">Livraison estimée sous 24-48h ouvrés.</p>
      ${trackingNumber ? `<p style="margin:12px 0 0;color:#166534;font-size:13px;">Numéro de suivi : <strong style="font-family:monospace;">${trackingNumber}</strong></p>` : ""}
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td colspan="2" style="padding-bottom:8px;font-size:12px;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;">Articles expédiés</td></tr>
      ${itemRows}
      <tr>
        <td style="padding-top:12px;font-weight:700;font-size:15px;color:#1c1917;">Total</td>
        <td style="padding-top:12px;font-weight:700;font-size:15px;color:#1c1917;text-align:right;">${total.toFixed(2)} €</td>
      </tr>
    </table>

    <p style="margin:0;color:#a8a29e;font-size:12px;">Un problème ? <a href="${SITE_URL}/contact" style="color:#a8a29e;">Contactez-nous</a>.</p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `📦 Commande ${orderNumber} expédiée — ${SITE_NAME}`,
    html: baseLayout(content),
  });
}

// ─── Email 3 : Livraison confirmée ────────────────────────────────────────────

export async function sendDeliveryNotification(opts: {
  to: string;
  customerName: string;
  orderRef: string;
  orderNumber: string;
}) {
  const { to, customerName, orderNumber } = opts;

  const content = `
    <div style="display:inline-block;background:#f5f5f4;border-radius:6px;padding:4px 12px;margin-bottom:16px;">
      <span style="font-size:13px;color:#78716c;font-weight:600;">Commande ${orderNumber}</span>
    </div>
    <h1 style="margin:0 0 4px;font-size:24px;color:#1c1917;">Votre colis est arrivé&nbsp;! ✅</h1>
    <p style="margin:0 0 24px;color:#78716c;font-size:15px;">Bonjour ${customerName}, nous espérons que votre commande vous a bien été livrée.</p>

    <div style="background:#fefce8;border:1px solid #fef08a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-weight:600;color:#713f12;font-size:14px;">⭐ Vous avez aimé ?</p>
      <p style="margin:0 0 16px;color:#854d0e;font-size:13px;">Votre avis compte beaucoup pour nous et aide d'autres clients à découvrir nos produits.</p>
      ${btn(`${SITE_URL}/laisser-un-avis`, "Laisser un avis")}
    </div>

    <p style="margin:0;color:#a8a29e;font-size:12px;">Un problème avec votre commande ? <a href="${SITE_URL}/contact" style="color:#a8a29e;">Contactez-nous</a>, nous trouverons une solution.</p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `✅ Commande ${orderNumber} livrée — ${SITE_NAME}`,
    html: baseLayout(content),
  });
}

// ─── Email 4 : Lien magique (connexion) ───────────────────────────────────────

export async function sendMagicLink(opts: { to: string; magicLink: string }) {
  const { to, magicLink } = opts;

  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#1c1917;">Connexion à votre espace client</h1>
    <p style="margin:0 0 32px;color:#78716c;font-size:15px;">Cliquez sur le bouton ci-dessous pour accéder à vos achats. Ce lien est valable <strong>30 minutes</strong>.</p>
    <div style="text-align:center;margin-bottom:32px;">
      ${btn(magicLink, "Me connecter")}
    </div>
    <p style="margin:0;color:#a8a29e;font-size:12px;">Si vous n'avez pas demandé cette connexion, ignorez cet email.</p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `🔐 Votre lien de connexion — ${SITE_NAME}`,
    html: baseLayout(content),
  });
}
