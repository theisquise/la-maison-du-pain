"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Lock, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function PanierPage() {
  const { state, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Livraison uniquement sur les produits physiques
  const hasPhysical = state.items.some((i) => i.type === "product");
  const physicalTotal = state.items.filter((i) => i.type === "product").reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = !hasPhysical ? 0 : physicalTotal >= 50 ? 0 : 4.9;

  // Réductions pack ebooks
  const ebookItems = state.items.filter((i) => i.type === "ebook");
  const ebookCount = ebookItems.reduce((s, i) => s + i.quantity, 0);
  const ebookTotal = ebookItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const ebookDiscountPct = ebookCount >= 3 ? 20 : ebookCount >= 2 ? 10 : 0;
  const ebookDiscount = parseFloat((ebookTotal * ebookDiscountPct / 100).toFixed(2));

  // Réductions pack formations
  const formationItems = state.items.filter((i) => i.type === "formation");
  const formationCount = formationItems.reduce((s, i) => s + i.quantity, 0);
  const formationTotal = formationItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const formationDiscountPct = formationCount >= 2 ? 10 : 0;
  const formationDiscount = parseFloat((formationTotal * formationDiscountPct / 100).toFixed(2));

  const totalDiscount = ebookDiscount + formationDiscount;
  const total = totalPrice - totalDiscount + shipping;

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: state.items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Erreur lors du paiement");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création de la session de paiement. Vérifiez votre configuration Stripe.");
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <ShoppingBag className="w-20 h-20 text-stone-200 mb-6" />
        <h1 className="font-serif text-3xl font-bold text-bakery-black mb-3">Votre panier est vide</h1>
        <p className="text-stone-500 mb-8">Ajoutez de délicieux produits ou une formation pour commencer.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/boutique" className="btn-primary">Voir la boutique</Link>
          <Link href="/formations" className="btn-outline">Voir les formations</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl font-bold text-bakery-black mb-10">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Articles */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <div key={item.id} className="flex gap-5 bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              {/* Image */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>

              {/* Détails */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-bakery-black mb-0.5 leading-snug">{item.name}</h3>
                    <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full capitalize">
                      {item.type === "ebook" ? "📄 Ebook PDF" : item.type === "formation" ? "🎓 Formation" : "🥐 Produit"}
                    </span>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-red-500 transition-colors p-1 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantité */}
                  {item.type === "product" ? (
                    <div className="flex items-center gap-1 border border-stone-200 rounded-full">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 rounded-full">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 rounded-full">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400">Accès numérique</span>
                  )}

                  <span className="font-bold text-lg text-bakery-black">
                    {(item.price * item.quantity).toFixed(2).replace(".", ",")} €
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-stone-400 hover:text-red-500 transition-colors mt-2">
            Vider le panier
          </button>
        </div>

        {/* Récapitulatif */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-6">Récapitulatif</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-stone-500 text-sm">
                <span>Sous-total ({state.items.reduce((s, i) => s + i.quantity, 0)} article{state.items.length > 1 ? "s" : ""})</span>
                <span>{totalPrice.toFixed(2).replace(".", ",")} €</span>
              </div>

              {ebookDiscount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Réduction pack ebooks ({ebookDiscountPct}%)</span>
                  <span>−{ebookDiscount.toFixed(2).replace(".", ",")} €</span>
                </div>
              )}
              {formationDiscount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Réduction pack formations ({formationDiscountPct}%)</span>
                  <span>−{formationDiscount.toFixed(2).replace(".", ",")} €</span>
                </div>
              )}

              {hasPhysical && (
                <>
                  <div className="flex justify-between text-stone-500 text-sm">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-medium">Gratuite</span> : `${shipping.toFixed(2).replace(".", ",")} €`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-stone-400">Livraison gratuite dès 50 € d'achat</p>
                  )}
                </>
              )}

              <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-lg text-bakery-black">
                <span>Total</span>
                <span>{total.toFixed(2).replace(".", ",")} €</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-bakery-black text-white py-4 rounded-full font-medium hover:bg-stone-800 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {loading ? "Redirection…" : "Payer en sécurité"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-stone-400 text-xs">
              <Lock className="w-3 h-3" />
              Paiement sécurisé SSL — Stripe
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 text-stone-500 text-xs mb-1.5">
                <Truck className="w-4 h-4" />
                <span>Livraison en 24-48h (produits physiques)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <ArrowRight className="w-4 h-4" />
                <span>Accès immédiat après paiement (ebooks & formations)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
