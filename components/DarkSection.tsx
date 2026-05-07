import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export default function DarkSection() {
  const { darkSection } = siteConfig;

  return (
    <section className="bg-bakery-black py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden order-2 lg:order-1">
            <Image
              src={darkSection.image}
              alt="Délicieux cookies"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Texte */}
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              {darkSection.heading}
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-10">
              {darkSection.text}
            </p>
            <Link
              href={darkSection.ctaLink}
              className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-bakery-black transition-all duration-200 group"
            >
              <span className="font-bold">{darkSection.price}</span>
              <span className="w-px h-4 bg-current opacity-40" />
              {darkSection.ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
