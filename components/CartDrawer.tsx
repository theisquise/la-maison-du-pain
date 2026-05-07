"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <>
      {/* Overlay */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          state.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-serif font-semibold text-lg">Mon Panier</h2>
            {state.items.length > 0 && (
              <span className="bg-bakery-black text-white text-xs px-2 py-0.5 rounded-full">
                {state.items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-400">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-center">Votre panier est vide.<br />Ajoutez de délicieux produits !</p>
              <Link
                href="/boutique"
                onClick={closeCart}
                className="bg-bakery-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Voir la boutique
              </Link>
            </div>
          ) : (
            state.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-stone-50">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-bakery-black line-clamp-2">{item.name}</p>
                  <p className="text-bakery-gold font-bold mt-1">
                    {(item.price * item.quantity).toFixed(2).replace(".", ",")} €
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {item.type !== "ebook" && item.type !== "formation" ? (
                      <div className="flex items-center gap-1 border border-stone-200 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 rounded-full transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 rounded-full transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                        {item.type === "ebook" ? "PDF" : "Accès en ligne"}
                      </span>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="p-5 border-t border-stone-100 space-y-3">
            <div className="flex justify-between text-sm text-stone-500">
              <span>Sous-total</span>
              <span>{totalPrice.toFixed(2).replace(".", ",")} €</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{totalPrice.toFixed(2).replace(".", ",")} €</span>
            </div>
            <Link
              href="/panier"
              onClick={closeCart}
              className="block w-full bg-bakery-black text-white text-center py-3.5 rounded-full font-medium hover:bg-stone-800 transition-colors"
            >
              Voir le panier & Payer
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-stone-500 hover:text-bakery-black transition-colors py-1"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
