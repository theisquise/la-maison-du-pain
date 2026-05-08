"use client";

import { useState } from "react";
import { Send, Check, AlertCircle } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { newsletter } = siteConfig;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState("success");
      setEmail("");
    } catch {
      setState("error");
    }
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
            {state === "success" ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl">
                <Check className="w-5 h-5 shrink-0" />
                <p className="font-medium">Merci ! Vous êtes bien inscrit(e). Un email de bienvenue vous a été envoyé !</p>
              </div>
            ) : (
              <>
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
                    disabled={state === "loading"}
                    className="bg-bakery-black text-white px-6 py-4 rounded-full hover:bg-stone-800 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 flex items-center gap-2 font-medium shrink-0"
                  >
                    {state === "loading" ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{newsletter.ctaText}</span>
                  </button>
                </form>
                {state === "error" && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Une erreur est survenue. Réessayez dans un instant.
                  </div>
                )}
                <p className="text-stone-400 text-xs mt-3 ml-2">
                  🔒 Pas de spam. Désabonnement en 1 clic.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
