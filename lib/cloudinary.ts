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
