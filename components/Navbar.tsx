"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Search, Menu, X, ChefHat, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { siteConfig, navigation } from "@/data/site-config";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-serif font-bold text-lg text-bakery-black shrink-0">
              <ChefHat className="w-7 h-7 text-bakery-gold" />
              <span className="hidden sm:inline">{siteConfig.name}</span>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-stone-600 hover:text-bakery-black transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Espace client */}
              <Link
                href="/mon-compte"
                className="p-2 text-stone-500 hover:text-bakery-black transition-colors"
                aria-label="Mon compte"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Recherche */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-500 hover:text-bakery-black transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Panier */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-stone-500 hover:text-bakery-black transition-colors"
                aria-label="Panier"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-bakery-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Menu mobile */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-stone-500 hover:text-bakery-black transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          {searchOpen && (
            <div className="pb-3 animate-fade-in">
              <input
                type="text"
                placeholder="Rechercher un produit, une formation…"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-full text-sm focus:outline-none focus:border-bakery-black transition-colors"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white animate-fade-in">
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-stone-700 hover:text-bakery-black border-b border-stone-50 font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/mon-compte"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-stone-700 hover:text-bakery-black font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Mon compte
              </Link>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
