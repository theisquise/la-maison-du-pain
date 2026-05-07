"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { newsletter } = siteConfig;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Intégrez ici votre service d'emailing (Mailchimp, Brevo, ConvertKit...)
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
    setEmail("");
  };

  return (
    <section className="py-20 bg-peach-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-bakery-black leading-tight mb-4">
              {newsletter.heading}
            </h2>
            <p className="text-stone-500 text-lg">{newsletter.subheading}</p>
          </div>

          {/* Formulaire */}
          <div>
            {sent ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl">
                <Check className="w-5 h-5 shrink-0" />
                <p className="font-medium">Merci ! Vous êtes bien inscrit(e). Bienvenue dans la famille !</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.placeholder}
                  required
                  className="flex-1 px-5 py-4 rounded-full border border-stone-200 bg-white focus:outline-none focus:border-bakery-black text-sm transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-bakery-black text-white px-6 py-4 rounded-full hover:bg-stone-800 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 flex items-center gap-2 font-medium shrink-0"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{newsletter.ctaText}</span>
                </button>
              </form>
            )}
            <p className="text-stone-400 text-xs mt-3 ml-2">
              🔒 Pas de spam. Désabonnement en 1 clic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
