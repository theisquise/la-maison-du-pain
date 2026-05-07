import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function Bestsellers() {
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-center text-bakery-black mb-12">
          Nos Meilleures Ventes
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 border-2 border-bakery-black text-bakery-black px-8 py-3.5 rounded-full font-medium hover:bg-bakery-black hover:text-white transition-all duration-200 group"
          >
            Découvrir tous les produits
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
