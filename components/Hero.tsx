import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export default function Hero() {
  const { hero } = siteConfig;

  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh] items-center gap-8 py-16">
          {/* Texte */}
          <div className="animate-slide-up">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-bakery-black leading-[1.05] tracking-tight mb-6">
              {hero.heading}
            </h1>
            <p className="text-stone-500 text-lg mb-10 max-w-md leading-relaxed">
              {hero.subheading}
            </p>

            {/* Badge circulaire + CTA */}
            <div className="flex items-center gap-8">
              {/* Badge rotatif */}
              <div className="relative w-24 h-24 shrink-0">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full animate-spin"
                  style={{ animationDuration: "15s" }}
                >
                  <path
                    id="circle"
                    d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text fontSize="11.5" fontFamily="serif" fill="#0A0A0A" letterSpacing="2">
                    <textPath href="#circle">{hero.badgeText}</textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-bakery-black rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <Link
                href={hero.ctaLink}
                className="bg-bakery-black text-white px-8 py-4 rounded-full font-medium hover:bg-stone-800 transition-all hover:scale-105 text-sm sm:text-base"
              >
                {hero.ctaText}
              </Link>
            </div>
          </div>

          {/* Image produit */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Carré noir de fond */}
            <div className="absolute top-0 right-0 w-3/4 h-4/5 bg-bakery-black rounded-3xl hidden lg:block" />
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={hero.image}
                alt="Viennoiseries fraîches"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
