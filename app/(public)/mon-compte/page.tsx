"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, ShoppingBag, LogOut, BookOpen, Video, Package, Loader2, Truck, CheckCircle } from "lucide-react";
import type { Customer, Order } from "@/lib/customer-data";

type MeResponse = { customer: Customer; orders: Order[] };

const TYPE_ICONS: Record<string, React.ReactNode> = {
  ebook: <BookOpen className="w-4 h-4" />,
  formation: <Video className="w-4 h-4" />,
  product: <Package className="w-4 h-4" />,
};

const TYPE_LABELS: Record<string, string> = {
  ebook: "Ebook",
  formation: "Formation",
  product: "Produit physique",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function formatPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

export default function MonComptePage() {
  const router = useRouter();
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/me")
      .then((r) => {
        if (r.status === 401) {
          router.replace("/mon-compte/connexion");
          return null;
        }
        return r.json();
      })
      .then((d) => d && setData(d))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/customer/auth/logout", { method: "POST" });
    router.push("/mon-compte/connexion");
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    );
  }

  if (!data) return null;

  const { customer, orders } = data;

  // Tous les produits numériques achetés (dédupliqués par id)
  const digitalItems = Array.from(
    new Map(
      orders
        .flatMap((o) => o.items)
        .filter((i) => i.type !== "product")
        .map((i) => [i.id, i])
    ).values()
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-bakery-black">
            Bonjour, {customer.name.split(" ")[0]} 👋
          </h1>
          <p className="text-stone-500 mt-1">{customer.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-stone-400 hover:text-bakery-black text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>

      {/* Bibliothèque numérique */}
      <section className="mb-12">
        <h2 className="font-serif text-xl font-bold text-bakery-black mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Ma bibliothèque
        </h2>

        {digitalItems.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-8 text-center">
            <p className="text-stone-400 mb-4">Vous n'avez pas encore de contenu numérique.</p>
            <Link href="/formations" className="btn-primary inline-flex">
              Découvrir les formations
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {digitalItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-stone-100 rounded-2xl p-5 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-peach-100 rounded-xl flex items-center justify-center text-bakery-brown">
                    {TYPE_ICONS[item.type]}
                  </div>
                  <div>
                    <p className="font-medium text-bakery-black">{item.name}</p>
                    <p className="text-xs text-stone-400">{TYPE_LABELS[item.type]}</p>
                  </div>
                </div>
                <a
                  href={`/api/download/${item.id}`}
                  className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Historique commandes */}
      <section>
        <h2 className="font-serif text-xl font-bold text-bakery-black mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Mes commandes
        </h2>

        {orders.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-8 text-center">
            <p className="text-stone-400 mb-4">Aucune commande pour le moment.</p>
            <Link href="/boutique" className="btn-primary inline-flex">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.orderNumber && (
                        <span className="text-xs font-mono font-semibold text-bakery-gold bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
                          {order.orderNumber}
                        </span>
                      )}
                      <p className="text-sm font-medium text-bakery-black">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    {order.trackingNumber && (
                      <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Suivi : <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-bakery-black">{formatPrice(order.totalAmount)}</p>
                    {order.status === "delivered" ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Livrée
                      </span>
                    ) : order.status === "shipped" ? (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Expédiée
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        ✓ Payée
                      </span>
                    )}
                  </div>
                </div>
                <div className="border-t border-stone-50 pt-3 space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-stone-600">
                        {TYPE_ICONS[item.type]}
                        {item.name}
                      </div>
                      <span className="text-stone-400">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-center text-stone-400 text-sm mt-10">
        Un problème ?{" "}
        <Link href="/contact" className="underline hover:text-bakery-black transition-colors">
          Contactez-nous
        </Link>
      </p>
    </div>
  );
}
