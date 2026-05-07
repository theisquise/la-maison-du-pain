import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";
const FOLDER = "maison-du-pain";

export function isConfigured() {
  return !!(CLOUD_NAME && API_KEY && API_SECRET);
}

function sign(params: Record<string, string>) {
  const str = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHash("sha1").update(str + API_SECRET).digest("hex");
}

type CloudinaryResult = {
  public_id: string;
  secure_url: string;
  bytes: number;
  width: number;
  height: number;
};

export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<CloudinaryResult> {
  const timestamp = String(Math.round(Date.now() / 1000));
  const params = { folder: FOLDER, timestamp };
  const signature = sign(params);

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)]), filename);
  form.append("api_key", API_KEY);
  form.append("timestamp", timestamp);
  form.append("folder", FOLDER);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Cloudinary: ${await res.text()}`);
  return res.json() as Promise<CloudinaryResult>;
}

export async function deleteFromCloudinary(publicId: string) {
  const timestamp = String(Math.round(Date.now() / 1000));
  const params = { public_id: publicId, timestamp };
  const signature = sign(params);

  const form = new FormData();
  form.append("api_key", API_KEY);
  form.append("timestamp", timestamp);
  form.append("public_id", publicId);
  form.append("signature", signature);

  await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
    method: "POST",
    body: form,
  });
}

// URL optimisée : WebP automatique, qualité auto, resize à max 1400px
export function cdnUrl(publicId: string, transform = "f_auto,q_auto,w_1400,c_limit") {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}

type CloudinaryResource = {
  public_id: string;
  format: string;
  bytes: number;
  created_at: string;
};

export type CloudinaryImageEntry = {
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  url: string;
  publicId: string;
};

// Fetch the full image list from Cloudinary — survives redeploys
export async function listFromCloudinary(): Promise<CloudinaryImageEntry[]> {
  const url = new URL(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`);
  url.searchParams.set("prefix", `${FOLDER}/`);
  url.searchParams.set("type", "upload");
  url.searchParams.set("max_results", "500");

  const creds = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${creds}` },
  });
  if (!res.ok) throw new Error(`Cloudinary list: ${await res.text()}`);

  const data = await res.json() as { resources: CloudinaryResource[] };
  return data.resources.map((r) => {
    const name = `${r.public_id.split("/").pop()}.${r.format}`;
    return {
      filename: name,
      originalName: name,
      size: r.bytes,
      uploadedAt: r.created_at,
      url: cdnUrl(r.public_id),
      publicId: r.public_id,
    };
  });
}
