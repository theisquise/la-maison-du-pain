"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { products, productCategories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function BoutiquePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, sortBy]);

  return (
    <>
      {/* Header */}
      <div className="page-header text-center">
        <h1 className="section-title mb-3">Notre Boutique</h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto">
          Pains artisanaux, viennoiseries et pâtisseries préparés chaque matin avec passion.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            {productCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-bakery-black text-white"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tri */}
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <SlidersHorizontal className="w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-bakery-black text-bakery-black"
            >
              <option value="default">Trier par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>
        </div>

        {/* Résultats */}
        <p className="text-stone-400 text-sm mb-6">{filtered.length} produit{filtered.length > 1 ? "s" : ""}</p>

        {/* Grille */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg">Aucun produit dans cette catégorie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
