"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials, testimonialsConfig } from "@/data/testimonials";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-center text-bakery-black mb-14 leading-tight max-w-2xl mx-auto">
          {testimonialsConfig.heading}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Image produit */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src={testimonialsConfig.productImage}
              alt="Nos produits"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Témoignage */}
          <div className="relative">
            {/* Navigation */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:block">
              <button
                onClick={prev}
                className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-stone-50 transition-colors border border-stone-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 rounded-3xl p-8 lg:p-10">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-bakery-gold ring-offset-2">
                  {t.avatar ? (
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-peach-200 flex items-center justify-center font-serif text-xl font-bold">
                      {t.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-bakery-black">{t.name}</p>
                  {t.role && <p className="text-stone-400 text-sm">{t.role}</p>}
                </div>
              </div>

              {/* Étoiles */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-bakery-gold text-bakery-gold" />
                ))}
              </div>

              {/* Titre */}
              <h3 className="font-serif text-xl font-bold text-bakery-black mb-3">
                Excellent !
              </h3>

              {/* Texte */}
              <p className="text-stone-600 leading-relaxed mb-4 italic">"{t.text}"</p>

              {t.product && (
                <p className="text-xs text-stone-400">
                  Achat vérifié : <span className="font-medium">{t.product}</span>
                </p>
              )}
            </div>

            {/* Navigation mobile + desktop droite */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === current ? "w-6 h-2 bg-bakery-black" : "w-2 h-2 bg-stone-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2 lg:hidden">
                <button onClick={prev} className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} className="w-10 h-10 bg-bakery-black text-white rounded-full flex items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block">
              <button
                onClick={next}
                className="w-10 h-10 bg-bakery-black text-white rounded-full shadow-md flex items-center justify-center hover:bg-stone-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
