import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "data", "db", "images");

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const safe = path.basename(params.filename);
  const filepath = path.join(IMAGES_DIR, safe);

  if (!fs.existsSync(filepath)) {
    return new NextResponse("Image introuvable", { status: 404 });
  }

  const ext = path.extname(safe).toLowerCase();
  const contentTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };
  const contentType = contentTypes[ext] ?? "application/octet-stream";
  const buffer = fs.readFileSync(filepath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
