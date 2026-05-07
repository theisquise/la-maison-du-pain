import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_DIR = path.join(process.cwd(), "data", "db");
const CUSTOMERS_FILE = "customers.json";
const UPLOADS_DIR = path.join(DB_DIR, "uploads");

export type Customer = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  name: string;
  type: "product" | "formation" | "ebook";
  price: number;
};

export type Order = {
  id: string;
  customerId: string;
  stripeSessionId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "paid";
  createdAt: string;
};

export type MagicLink = {
  token: string;
  customerId: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
};

type DB = {
  customers: Customer[];
  orders: Order[];
  magicLinks: MagicLink[];
};

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readDB(): DB {
  ensureDir();
  const filepath = path.join(DB_DIR, CUSTOMERS_FILE);
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, "utf-8")) as DB;
    }
  } catch {
    // ignore
  }
  return { customers: [], orders: [], magicLinks: [] };
}

function writeDB(db: DB) {
  ensureDir();
  fs.writeFileSync(path.join(DB_DIR, CUSTOMERS_FILE), JSON.stringify(db, null, 2), "utf-8");
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function getCustomerByEmail(email: string): Customer | undefined {
  const db = readDB();
  return db.customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function getCustomerById(id: string): Customer | undefined {
  const db = readDB();
  return db.customers.find((c) => c.id === id);
}

export function createOrUpdateCustomer(email: string, name: string): Customer {
  const db = readDB();
  const existing = db.customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    if (name && existing.name !== name) {
      existing.name = name;
      writeDB(db);
    }
    return existing;
  }
  const customer: Customer = {
    id: "cust_" + crypto.randomBytes(8).toString("hex"),
    email: email.toLowerCase(),
    name,
    createdAt: new Date().toISOString(),
  };
  db.customers.push(customer);
  writeDB(db);
  return customer;
}

export function getAllCustomers(): Customer[] {
  return readDB().customers;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function createOrder(data: Omit<Order, "id" | "createdAt">): Order {
  const db = readDB();
  const order: Order = {
    ...data,
    id: "ord_" + crypto.randomBytes(8).toString("hex"),
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  writeDB(db);
  return order;
}

export function getOrdersByCustomer(customerId: string): Order[] {
  const db = readDB();
  return db.orders
    .filter((o) => o.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllOrders(): Order[] {
  return readDB().orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function orderAlreadyExists(stripeSessionId: string): boolean {
  return readDB().orders.some((o) => o.stripeSessionId === stripeSessionId);
}

// ─── Magic links ──────────────────────────────────────────────────────────────

export function saveMagicLink(link: MagicLink) {
  const db = readDB();
  // Purge expired links older than 24h to keep the file clean
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  db.magicLinks = db.magicLinks.filter((l) => new Date(l.createdAt).getTime() > cutoff);
  db.magicLinks.push(link);
  writeDB(db);
}

export function consumeMagicLink(token: string): MagicLink | null {
  const db = readDB();
  const link = db.magicLinks.find((l) => l.token === token);
  if (!link) return null;
  if (link.usedAt) return null;
  if (new Date(link.expiresAt) < new Date()) return null;
  link.usedAt = new Date().toISOString();
  writeDB(db);
  return link;
}

// ─── Uploads (fichiers numériques) ────────────────────────────────────────────

export type UploadedFile = {
  productId: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
};

const UPLOADS_META_FILE = "uploads-meta.json";

export function getUploadsMeta(): UploadedFile[] {
  const db = readDB();
  const filepath = path.join(DB_DIR, UPLOADS_META_FILE);
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, "utf-8")) as UploadedFile[];
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveUploadMeta(file: UploadedFile) {
  const filepath = path.join(DB_DIR, UPLOADS_META_FILE);
  const files = getUploadsMeta().filter((f) => f.productId !== file.productId);
  files.push(file);
  fs.writeFileSync(filepath, JSON.stringify(files, null, 2), "utf-8");
}

export function getUploadPathForProduct(productId: string): string | null {
  const meta = getUploadsMeta().find((f) => f.productId === productId);
  if (!meta) return null;
  const fullPath = path.join(UPLOADS_DIR, meta.filename);
  return fs.existsSync(fullPath) ? fullPath : null;
}

export function getUploadsDir(): string {
  ensureDir();
  return UPLOADS_DIR;
}
