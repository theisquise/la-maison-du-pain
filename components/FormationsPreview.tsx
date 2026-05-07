import Link from "next/link";
import { ArrowRight, BookOpen, Video } from "lucide-react";
import { getFormations, getConfig } from "@/lib/admin-data";
import ProductCard from "./ProductCard";

export default function FormationsPreview() {
  const featured = getFormations().filter((f) => f.bestseller).slice(0, 3);
  const { siteConfig } = getConfig();
  const { formationsSection } = siteConfig;

  return (
    <section className="py-20 bg-peach-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="flex items-center gap-1.5 bg-white text-bakery-black text-sm px-4 py-1.5 rounded-full font-medium shadow-sm">
              <Video className="w-4 h-4 text-bakery-gold" />
              Formations vidéo
            </span>
            <span className="flex items-center gap-1.5 bg-white text-bakery-black text-sm px-4 py-1.5 rounded-full font-medium shadow-sm">
              <BookOpen className="w-4 h-4 text-bakery-gold" />
              Ebooks PDF
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-bakery-black mb-4">
            {formationsSection.heading}
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            {formationsSection.text}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featured.map((f) => (
            <ProductCard key={f.id} item={f} />
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/formations"
            className="inline-flex items-center gap-2 bg-bakery-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-stone-800 transition-all hover:scale-105 group"
          >
            Voir toutes les formations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/ebooks"
            className="inline-flex items-center gap-2 border-2 border-bakery-black text-bakery-black px-8 py-3.5 rounded-full font-medium hover:bg-bakery-black hover:text-white transition-all duration-200"
          >
            Voir les ebooks
          </Link>
        </div>
      </div>
    </section>
  );
}
