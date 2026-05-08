"use client";

import { useEffect, useState, useRef } from "react";
import { Users, ShoppingBag, Upload, Trash2, FileText, Loader2 } from "lucide-react";
import type { Customer, Order, UploadedFile } from "@/lib/customer-data";

type AdminData = { customers: Customer[]; orders: Order[] };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
function formatPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}
function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
  return (bytes / 1024).toFixed(0) + " Ko";
}

export default function ClientsPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [productId, setProductId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadMsg, setUploadMsg] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/clients").then((r) => r.json()),
      fetch("/api/admin/uploads").then((r) => r.json()),
    ]).then(([d, u]) => {
      setData(d);
      setUploads(u);
      setLoading(false);
    });
  }, []);

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file || !productId.trim()) {
      setUploadMsg("Renseignez l'ID produit et sélectionnez un fichier.");
      return;
    }
    setUploading(true);
    setUploadMsg("");
    const form = new FormData();
    form.append("file", file);
    form.append("productId", productId.trim());
    const res = await fetch("/api/admin/uploads", { method: "POST", body: form });
    const json = await res.json();
    if (res.ok) {
      setUploadMsg("✅ Fichier uploadé avec succès !");
      setProductId("");
      if (fileRef.current) fileRef.current.value = "";
      const u = await fetch("/api/admin/uploads").then((r) => r.json());
      setUploads(u);
    } else {
      setUploadMsg("❌ " + (json.error ?? "Erreur"));
    }
    setUploading(false);
  }

  async function handleDelete(pid: string) {
    if (!confirm("Supprimer ce fichier ?")) return;
    await fetch("/api/admin/uploads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: pid }),
    });
    setUploads((prev) => prev.filter((f) => f.productId !== pid));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  const { customers, orders } = data!;
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Users className="w-6 h-6 text-amber-400" /> Clients & Fichiers
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Clients", value: customers.length, icon: <Users className="w-4 h-4" /> },
          { label: "Commandes", value: orders.length, icon: <ShoppingBag className="w-4 h-4" /> },
          { label: "Chiffre d'affaires", value: formatPrice(totalRevenue), icon: <span className="text-sm">€</span> },
        ].map((s) => (
          <div key={s.label} className="bg-stone-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-400 text-sm mb-1">
              {s.icon} {s.label}
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Upload fichiers numériques */}
      <div className="bg-stone-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-amber-400" /> Fichiers numériques (ebooks & formations)
        </h2>
        <p className="text-stone-400 text-sm mb-4">
          L'ID produit doit correspondre exactement à l'ID utilisé dans votre catalogue (formations ou ebooks).
        </p>

        <div className="flex gap-3 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="ID du produit (ex: ebook-levain)"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="flex-1 min-w-48 bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.epub,.zip,.mp4"
            className="text-stone-400 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-stone-700 file:text-white file:cursor-pointer hover:file:bg-stone-600"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-stone-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Uploader
          </button>
        </div>

        {uploadMsg && (
          <p className="text-sm mb-4 text-stone-300">{uploadMsg}</p>
        )}

        {uploads.length > 0 ? (
          <div className="space-y-2">
            {uploads.map((f) => (
              <div key={f.productId} className="flex items-center justify-between bg-stone-700 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">{f.originalName}</p>
                    <p className="text-stone-400 text-xs">ID: {f.productId} · {formatSize(f.size)} · {formatDate(f.uploadedAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(f.productId)}
                  className="text-stone-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-500 text-sm">Aucun fichier uploadé.</p>
        )}
      </div>

      {/* Liste clients */}
      <div className="bg-stone-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" /> Clients ({customers.length})
        </h2>
        {customers.length === 0 ? (
          <p className="text-stone-500 text-sm">Aucun client enregistré.</p>
        ) : (
          <div className="space-y-3">
            {customers.map((c) => {
              const clientOrders = orders.filter((o) => o.customerId === c.id);
              const spent = clientOrders.reduce((s, o) => s + o.totalAmount, 0);
              return (
                <div key={c.id} className="bg-stone-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{c.name}</p>
                      <p className="text-stone-400 text-sm">{c.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-bold">{formatPrice(spent)}</p>
                      <p className="text-stone-400 text-xs">{clientOrders.length} commande{clientOrders.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <p className="text-stone-500 text-xs">Client depuis le {formatDate(c.createdAt)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toutes les commandes */}
      <div className="bg-stone-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-amber-400" /> Toutes les commandes ({orders.length})
        </h2>
        {orders.length === 0 ? (
          <p className="text-stone-500 text-sm">Aucune commande.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => {
              const c = customers.find((cu) => cu.id === o.customerId);
              return (
                <div key={o.id} className="bg-stone-700 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{c?.name ?? o.customerId}</p>
                    <p className="text-stone-400 text-xs">{c?.email} · {formatDate(o.createdAt)}</p>
                    <p className="text-stone-500 text-xs mt-0.5">
                      {o.items.map((i) => i.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-amber-400 font-bold">{formatPrice(o.totalAmount)}</p>
                    <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">Payée</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
