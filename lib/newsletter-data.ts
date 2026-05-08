import fs from "fs";
import path from "path";
import crypto from "crypto";

const FILE = path.join(process.cwd(), "data", "db", "newsletter.json");

export type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
  unsubscribeToken: string;
};

type DB = { subscribers: Subscriber[] };

function read(): DB {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return { subscribers: [] };
  }
}

function write(db: DB) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export function getSubscribers(): Subscriber[] {
  return read().subscribers;
}

export function findSubscriber(email: string): Subscriber | undefined {
  return read().subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
}

export function addSubscriber(email: string): { subscriber: Subscriber; alreadyExists: boolean } {
  const db = read();
  const existing = db.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) return { subscriber: existing, alreadyExists: true };

  const subscriber: Subscriber = {
    id: crypto.randomUUID(),
    email,
    createdAt: new Date().toISOString(),
    unsubscribeToken: crypto.randomBytes(32).toString("hex"),
  };
  db.subscribers.push(subscriber);
  write(db);
  return { subscriber, alreadyExists: false };
}

export function unsubscribeByToken(token: string): boolean {
  const db = read();
  const idx = db.subscribers.findIndex((s) => s.unsubscribeToken === token);
  if (idx === -1) return false;
  db.subscribers.splice(idx, 1);
  write(db);
  return true;
}

export function deleteSubscriber(id: string): boolean {
  const db = read();
  const idx = db.subscribers.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  db.subscribers.splice(idx, 1);
  write(db);
  return true;
}
