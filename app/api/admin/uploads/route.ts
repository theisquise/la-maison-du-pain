import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveUploadMeta, getUploadsMeta, getUploadsDir } from "@/lib/customer-data";

export async function GET() {
  return NextResponse.json(getUploadsMeta());
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const productId = data.get("productId") as string | null;

    if (!file || !productId) {
      return NextResponse.json({ error: "Fichier ou productId manquant" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/epub+zip",
      "application/zip",
      "video/mp4",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non autorisé (PDF, EPUB, ZIP, MP4)" }, { status: 400 });
    }

    const MAX_SIZE = 500 * 1024 * 1024; // 500 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 500 MB)" }, { status: 400 });
    }

    const ext = path.extname(file.name);
    const safeFilename = `${productId}${ext}`;
    const uploadsDir = getUploadsDir();
    const filepath = path.join(uploadsDir, safeFilename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    saveUploadMeta({
      productId,
      filename: safeFilename,
      originalName: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, filename: safeFilename });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { productId } = (await req.json()) as { productId: string };
    const uploadsDir = getUploadsDir();
    const meta = getUploadsMeta();
    const entry = meta.find((f) => f.productId === productId);
    if (entry) {
      const filepath = path.join(uploadsDir, entry.filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
    const filepath2 = path.join(process.cwd(), "data", "db", "uploads-meta.json");
    const updated = meta.filter((f) => f.productId !== productId);
    fs.writeFileSync(filepath2, JSON.stringify(updated, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[upload delete]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
