import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { requireAdmin } from "@/lib/admin-guard";
import { isConfigured, uploadToCloudinary, deleteFromCloudinary, cdnUrl } from "@/lib/cloudinary";

const IMAGES_DIR = path.join(process.cwd(), "data", "db", "images");
const META_FILE = path.join(process.cwd(), "data", "db", "images-meta.json");

// SVG excluded: can embed JavaScript (XSS vector)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

type ImageMeta = {
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  url: string;
  publicId?: string; // Cloudinary public_id when CDN is configured
};

function ensureDir() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function readMeta(): ImageMeta[] {
  try {
    if (fs.existsSync(META_FILE)) return JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
  } catch {}
  return [];
}

function writeMeta(meta: ImageMeta[]) {
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2));
}

function buildLocalUrl(req: NextRequest, filename: string) {
  const host = req.headers.get("host") ?? "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  return `${proto}://${host}/api/images/${filename}`;
}

export async function GET(req: NextRequest) {
  const err = requireAdmin();
  if (err) return err;
  ensureDir();
  const meta = readMeta();
  // For local images (no publicId), rebuild URL from current host in case it changed
  const enriched = meta.map((m) =>
    m.publicId ? m : { ...m, url: buildLocalUrl(req, m.filename) }
  );
  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const err = requireAdmin();
  if (err) return err;
  try {
    ensureDir();
    const data = await req.formData();
    const file = data.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Type non autorisé (JPG, PNG, WEBP, GIF, SVG)" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const hash = crypto.randomBytes(6).toString("hex");
    const safeName = file.name.replace(/[^a-z0-9_.-]/gi, "-").replace(ext, "");
    const filename = `${safeName}-${hash}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    let entry: ImageMeta;

    if (isConfigured()) {
      const result = await uploadToCloudinary(buffer, filename);
      entry = {
        filename,
        originalName: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        url: cdnUrl(result.public_id),
        publicId: result.public_id,
      };
    } else {
      fs.writeFileSync(path.join(IMAGES_DIR, filename), buffer);
      entry = {
        filename,
        originalName: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        url: buildLocalUrl(req, filename),
      };
    }

    const meta = readMeta();
    meta.unshift(entry);
    writeMeta(meta);

    return NextResponse.json({ ok: true, ...entry });
  } catch (e) {
    console.error("[images upload]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = requireAdmin();
  if (err) return err;
  try {
    const { filename } = (await req.json()) as { filename: string };
    const safe = path.basename(filename);

    const meta = readMeta();
    const entry = meta.find((m) => m.filename === safe);

    if (entry?.publicId) {
      await deleteFromCloudinary(entry.publicId);
    } else {
      const filepath = path.join(IMAGES_DIR, safe);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }

    writeMeta(meta.filter((m) => m.filename !== safe));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[images delete]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
