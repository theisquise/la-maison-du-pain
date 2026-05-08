import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "db", "promo-codes.json");

export type PromoCode = {
  code: string;
  discountPct: number;
  description: string;
  active: boolean;
};

const DEFAULTS: PromoCode[] = [
  { code: "BIENVENUE5", discountPct: 5, description: "-5% newsletter bienvenue", active: true },
];

type DB = { codes: PromoCode[] };

function read(): DB {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return { codes: DEFAULTS };
  }
}

function write(db: DB) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export function getPromoCodes(): PromoCode[] {
  return read().codes;
}

export function validatePromoCode(code: string): PromoCode | null {
  const found = read().codes.find(
    (c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.active
  );
  return found ?? null;
}

export function addPromoCode(promo: PromoCode): void {
  const db = read();
  const idx = db.codes.findIndex((c) => c.code.toUpperCase() === promo.code.toUpperCase());
  if (idx >= 0) {
    db.codes[idx] = promo;
  } else {
    db.codes.push({ ...promo, code: promo.code.toUpperCase().trim() });
  }
  write(db);
}

export function deletePromoCode(code: string): boolean {
  const db = read();
  const idx = db.codes.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
  if (idx === -1) return false;
  db.codes.splice(idx, 1);
  write(db);
  return true;
}

export function togglePromoCode(code: string, active: boolean): boolean {
  const db = read();
  const item = db.codes.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (!item) return false;
  item.active = active;
  write(db);
  return true;
}
