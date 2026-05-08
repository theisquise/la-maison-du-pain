import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCustomerFromCookie, CUSTOMER_COOKIE } from "@/lib/customer-auth";
import { getOrdersByCustomer, getUploadPathForProduct, getUploadsMeta } from "@/lib/customer-data";

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;

  // 1. Vérifier l'authentification
  const token = req.cookies.get(CUSTOMER_COOKIE)?.value;
  const customer = await getCustomerFromCookie(token);
  if (!customer) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  // 2. Vérifier que le client a bien acheté ce produit
  const orders = getOrdersByCustomer(customer.id);
  const hasPurchased = orders.some((o) =>
    o.items.some((i) => i.id === productId && i.type !== "product")
  );
  if (!hasPurchased) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  // 3. Trouver le fichier
  const filePath = getUploadPathForProduct(productId);
  if (!filePath) {
    return NextResponse.json({ error: "Fichier non disponible" }, { status: 404 });
  }

  // 4. Récupérer les métadonnées pour le nom du fichier
  const meta = getUploadsMeta().find((f) => f.productId === productId);
  const filename = meta?.originalName ?? path.basename(filePath);

  // 5. Servir le fichier
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === ".pdf"
      ? "application/pdf"
      : ext === ".epub"
      ? "application/epub+zip"
      : ext === ".zip"
      ? "application/zip"
      : "application/octet-stream";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      "Content-Length": String(fileBuffer.length),
      "Cache-Control": "no-store",
    },
  });
}
