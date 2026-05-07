"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/data/products";
import type { Formation } from "@/data/formations";
import { levelLabels } from "@/data/formations";

type ProductCardProps = {
  item: Product | Formation;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-bakery-gold text-bakery-gold" : "text-stone-200"}`}
        />
      ))}
      <span className="text-xs text-stone-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ item }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const isFormation = "type" in item && (item.type === "formation" || item.type === "ebook");
  const formationItem = isFormation ? (item as Formation) : null;
  const productItem = !isFormation ? (item as Product) : null;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      type: isFormation ? (formationItem!.type as "formation" | "ebook") : "product",
      stripeProductId: item.stripeProductId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const detailHref = isFormation
    ? formationItem!.type === "ebook"
      ? `/ebooks`
      : `/formations`
    : `/boutique/${item.id}`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col">
      {/* Image cliquable */}
      <Link href={detailHref} className="relative aspect-square overflow-hidden bg-peach-100 block">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {"bestseller" in item && item.bestseller && (
            <span className="bg-bakery-black text-white text-xs px-2.5 py-1 rounded-full font-medium">
              Bestseller
            </span>
          )}
          {formationItem && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${levelLabels[formationItem.level].color}`}>
              {levelLabels[formationItem.level].label}
            </span>
          )}
          {"originalPrice" in item && item.originalPrice && (
            <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
              Promo
            </span>
          )}
        </div>
      </Link>

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={detailHref}>
          <h3 className="font-serif font-semibold text-bakery-black mb-1 line-clamp-2 leading-snug hover:text-stone-600 transition-colors">
            {item.name}
          </h3>
        </Link>

        {/* Infos formation */}
        {formationItem && (
          <p className="text-xs text-stone-400 mb-1.5">
            {formationItem.type === "formation" ? `📹 ${formationItem.duration}` : `📄 ${formationItem.pages} pages PDF`}
          </p>
        )}

        <StarRating rating={item.rating} />

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-lg text-bakery-black">
              {item.price.toFixed(2).replace(".", ",")} €
            </span>
            {"originalPrice" in item && item.originalPrice && (
              <span className="text-stone-400 text-sm line-through ml-2">
                {item.originalPrice.toFixed(2).replace(".", ",")} €
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              added
                ? "bg-green-500 text-white scale-95"
                : "bg-bakery-black text-white hover:bg-stone-700 hover:scale-105"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                Ajouté !
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Ajouter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
