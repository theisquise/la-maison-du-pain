"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  Package,
  Loader2,
  Euro,
} from "lucide-react";
import type { Customer, Order } from "@/lib/customer-data";

type OrderWithCustomer = Order & { customer: Customer | null };

type FilterTab = "all" | "to_ship" | "shipped" | "delivered" | "digital";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

function hasPhysical(order: Order) {
  return order.items.some((i) => i.type === "product");
}

function StatusBadge({ order }: { order: Order }) {
  if (!hasPhysical(order)) {
    return (
      <span className="text-xs bg-blue-900/40 text-blue-400 px-2.5 py-1 rounded-full font-medium">
        Accès numérique
      </span>
    );
  }
  if (order.status === "delivered") {
    return (
      <span className="text-xs bg-green-900/40 text-green-400 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
        <CheckCircle className="w-3 h-3" /> Livrée
      </span>
    );
  }
  if (order.status === "shipped") {
    return (
      <span className="text-xs bg-amber-900/40 text-amber-400 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
        <Truck className="w-3 h-3" /> Expédiée
      </span>
    );
  }
  return (
    <span className="text-xs bg-orange-900/40 text-orange-400 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
      <Clock className="w-3 h-3" /> À expédier
    </span>
  );
}

function TypeBadge({ type }: { type: "product" | "formation" | "ebook" }) {
  if (type === "product") return <span className="text-xs bg-stone-600 text-stone-300 px-1.5 py-0.5 rounded">🥐 Produit</span>;
  if (type === "formation") return <span className="text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded">🎓 Formation</span>;
  return <span className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">📄 Ebook</span>;
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then(({ customers, orders: rawOrders }: { customers: Customer[]; orders: Order[] }) => {
        const enriched: OrderWithCustomer[] = rawOrders.map((o) => ({
          ...o,
          customer: customers.find((c) => c.id === o.customerId) ?? null,
        }));
        setOrders(enriched);
        setLoading(false);
      });
  }, []);

  async function updateStatus(orderId: string, status: Order["status"]) {
    setUpdating(orderId);
    const trackingNumber = trackingInputs[orderId] ?? "";
    const res = await fetch(`/api/admin/commandes/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, trackingNumber }),
    });
    if (res.ok) {
      const updated: Order = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o))
      );
    }
    setUpdating(null);
  }

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const toShip = orders.filter((o) => hasPhysical(o) && o.status === "paid").length;
  const shipped = orders.filter((o) => o.status === "shipped").length;

  // Filter + search
  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q) ||
      o.id.includes(q);

    const matchFilter =
      filter === "all" ||
      (filter === "to_ship" && hasPhysical(o) && o.status === "paid") ||
      (filter === "shipped" && o.status === "shipped") ||
      (filter === "delivered" && o.status === "delivered") ||
      (filter === "digital" && !hasPhysical(o));

    return matchSearch && matchFilter;
  });

  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: "Toutes", count: orders.length },
    { id: "to_ship", label: "À expédier", count: toShip },
    { id: "shipped", label: "Expédiées", count: shipped },
    { id: "delivered", label: "Livrées", count: orders.filter((o) => o.status === "delivered").length },
    { id: "digital", label: "Numériques", count: orders.filter((o) => !hasPhysical(o)).length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Package className="w-6 h-6 text-amber-400" /> Gestion des commandes
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-stone-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-1">
            <ShoppingBag className="w-4 h-4" /> Total commandes
          </div>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
        </div>
        <div className="bg-stone-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-1">
            <Euro className="w-4 h-4" /> Chiffre d&apos;affaires
          </div>
          <p className="text-2xl font-bold text-white">{formatPrice(totalRevenue)}</p>
        </div>
        <div className={`rounded-xl p-4 ${toShip > 0 ? "bg-orange-900/40 border border-orange-800/50" : "bg-stone-800"}`}>
          <div className={`flex items-center gap-2 text-sm mb-1 ${toShip > 0 ? "text-orange-400" : "text-amber-400"}`}>
            <Truck className="w-4 h-4" /> À expédier
          </div>
          <p className={`text-2xl font-bold ${toShip > 0 ? "text-orange-300" : "text-white"}`}>{toShip}</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 pl-9 text-white text-sm placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                filter === tab.id
                  ? "bg-amber-600 text-white"
                  : "bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.id ? "bg-amber-700 text-amber-100" : "bg-stone-700 text-stone-400"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-stone-800 rounded-xl p-10 text-center text-stone-500">
          Aucune commande trouvée.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpanded = expanded === order.id;
            const isUpdating = updating === order.id;
            const physical = hasPhysical(order);

            return (
              <div key={order.id} className="bg-stone-800 rounded-xl overflow-hidden">
                {/* Header row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-stone-750 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-mono text-amber-500 bg-stone-700 px-2 py-0.5 rounded">
                        {order.orderNumber ?? "—"}
                      </span>
                      <p className="text-white font-medium">
                        {order.customer?.name ?? "Client inconnu"}
                      </p>
                      <StatusBadge order={order} />
                    </div>
                    <p className="text-stone-400 text-xs mt-0.5">
                      {order.customer?.email} · {formatDate(order.createdAt)}
                    </p>
                    <p className="text-stone-500 text-xs mt-0.5 truncate">
                      {order.items.map((i) => i.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <p className="text-amber-400 font-bold">{formatPrice(order.totalAmount)}</p>
                      <p className="text-stone-500 text-xs">{order.items.length} article{order.items.length > 1 ? "s" : ""}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-stone-700 px-5 py-4 space-y-4">
                    {/* Items */}
                    <div>
                      <p className="text-stone-400 text-xs font-medium uppercase tracking-wider mb-2">Articles</p>
                      <div className="space-y-1.5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TypeBadge type={item.type} />
                              <span className="text-stone-300 text-sm">{item.name}</span>
                            </div>
                            <span className="text-stone-400 text-sm">{formatPrice(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stripe session */}
                    <div>
                      <p className="text-stone-400 text-xs font-medium uppercase tracking-wider mb-1">Référence Stripe</p>
                      <p className="text-stone-400 text-xs font-mono bg-stone-900 px-3 py-1.5 rounded-lg break-all">{order.stripeSessionId}</p>
                    </div>

                    {/* Tracking info (if shipped) */}
                    {order.trackingNumber && (
                      <div>
                        <p className="text-stone-400 text-xs font-medium uppercase tracking-wider mb-1">Numéro de suivi</p>
                        <p className="text-amber-400 text-sm font-mono">{order.trackingNumber}</p>
                      </div>
                    )}
                    {order.shippedAt && (
                      <p className="text-stone-500 text-xs">Expédiée le {formatDate(order.shippedAt)}</p>
                    )}
                    {order.deliveredAt && (
                      <p className="text-stone-500 text-xs">Livrée le {formatDate(order.deliveredAt)}</p>
                    )}

                    {/* Status actions for physical orders */}
                    {physical && order.status !== "delivered" && (
                      <div className="border-t border-stone-700 pt-4">
                        <p className="text-stone-400 text-xs font-medium uppercase tracking-wider mb-3">Mettre à jour le statut</p>
                        {order.status === "paid" && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="Numéro de suivi (optionnel)"
                              value={trackingInputs[order.id] ?? ""}
                              onChange={(e) =>
                                setTrackingInputs((prev) => ({ ...prev, [order.id]: e.target.value }))
                              }
                              className="flex-1 bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm placeholder-stone-500 focus:outline-none focus:border-amber-500"
                            />
                            <button
                              onClick={() => updateStatus(order.id, "shipped")}
                              disabled={isUpdating}
                              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                            >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                              Marquer comme expédiée
                            </button>
                          </div>
                        )}
                        {order.status === "shipped" && (
                          <button
                            onClick={() => updateStatus(order.id, "delivered")}
                            disabled={isUpdating}
                            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 disabled:bg-stone-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Marquer comme livrée
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
