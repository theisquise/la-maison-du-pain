import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export default function TraditionSection() {
  const { tradition } = siteConfig;

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={tradition.image}
                alt="Tradition boulangère"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Décoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-peach-200 rounded-3xl -z-10 hidden lg:block" />
          </div>

          {/* Texte */}
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-bakery-black leading-tight mb-6">
              {tradition.heading}
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed mb-8">
              {tradition.text}
            </p>
            <Link
              href={tradition.ctaLink}
              className="inline-flex items-center gap-2 bg-bakery-black text-white px-8 py-4 rounded-full font-medium hover:bg-stone-800 transition-all hover:scale-105 group"
            >
              {tradition.ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
