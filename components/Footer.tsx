import Link from "next/link";
import { ChefHat, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { siteConfig, navigation } from "@/data/site-config";

export default function Footer() {
  const hours = siteConfig.hours;

  return (
    <footer className="bg-bakery-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Colonne 1 : Logo & Coordonnées */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ChefHat className="w-7 h-7 text-bakery-gold" />
              <span className="font-serif font-bold text-lg">{siteConfig.name}</span>
            </Link>
            <p className="text-stone-400 text-sm mb-4 leading-relaxed">{siteConfig.description}</p>
            <div className="space-y-2 text-sm text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-bakery-gold" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-bakery-gold" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-bakery-gold" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-5">Liens Rapides</h3>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/formations" className="text-stone-400 hover:text-white text-sm transition-colors">
                  Formations en ligne
                </Link>
              </li>
              <li>
                <Link href="/ebooks" className="text-stone-400 hover:text-white text-sm transition-colors">
                  Ebooks & PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Réseaux sociaux */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-5">Suivez-nous</h3>
            <div className="space-y-3">
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-stone-400 hover:text-white text-sm transition-colors group">
                <div className="w-8 h-8 rounded-full bg-stone-800 group-hover:bg-stone-700 flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </div>
                Facebook
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-stone-400 hover:text-white text-sm transition-colors group">
                <div className="w-8 h-8 rounded-full bg-stone-800 group-hover:bg-stone-700 flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </div>
                Instagram
              </a>
              <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-stone-400 hover:text-white text-sm transition-colors group">
                <div className="w-8 h-8 rounded-full bg-stone-800 group-hover:bg-stone-700 flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </div>
                Twitter / X
              </a>
            </div>
          </div>

          {/* Colonne 4 : Horaires */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-5">Horaires</h3>
            <ul className="space-y-1.5 text-sm text-stone-400">
              {Object.entries(hours).map(([jour, heure]) => (
                <li key={jour} className="flex justify-between gap-4">
                  <span className="capitalize">{jour}</span>
                  <span className="text-right">{heure}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-stone-500 text-sm">{siteConfig.footer.copyright}</p>
            <div className="flex items-center gap-3 text-stone-500 text-xs">
              <span className="hidden sm:inline">·</span>
              <Link href="/mentions-legales" className="hover:text-stone-300 transition-colors">Mentions légales</Link>
              <span>·</span>
              <Link href="/cgv" className="hover:text-stone-300 transition-colors">CGV</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-500 text-xs">{siteConfig.footer.paymentText}</span>
            <div className="flex items-center gap-2">
              {["Visa", "MC", "Amex", "CB"].map((card) => (
                <span key={card} className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded font-mono">
                  {card}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
