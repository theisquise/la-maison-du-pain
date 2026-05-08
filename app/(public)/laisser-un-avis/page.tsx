"use client";

import { useState } from "react";
import { Star, CheckCircle, AlertCircle } from "lucide-react";

export default function LaisserUnAvisPage() {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [product, setProduct] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text, rating, product }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setError(data.error ?? "Une erreur est survenue.");
        setStatus("error");
      }
    } catch {
      setError("Une erreur est survenue, veuillez réessayer.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-bakery-black mb-3">Merci pour votre avis !</h1>
        <p className="text-stone-500 max-w-md">
          Votre témoignage a bien été reçu. Il sera publié après validation par notre équipe.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-6 h-6 fill-bakery-gold text-bakery-gold" />
          ))}
        </div>
        <h1 className="font-serif text-4xl font-bold text-bakery-black mb-3">Laisser un avis</h1>
        <p className="text-stone-500">
          Votre expérience avec La Maison du Pain compte pour nous et pour les futurs clients.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 space-y-6">
        {/* Étoiles */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">Votre note *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    s <= (hover || rating)
                      ? "fill-bakery-gold text-bakery-gold"
                      : "fill-stone-200 text-stone-200"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 self-center text-sm text-stone-500">
              {["", "Mauvais", "Passable", "Bien", "Très bien", "Excellent !"][hover || rating]}
            </span>
          </div>
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Votre prénom *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marie"
            required
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-gold/30 focus:border-bakery-gold transition-colors"
          />
        </div>

        {/* Produit (optionnel) */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Produit acheté <span className="text-stone-400 font-normal">(optionnel)</span>
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="ex : Croissant au beurre, Formation Levain…"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-gold/30 focus:border-bakery-gold transition-colors"
          />
        </div>

        {/* Texte */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Votre avis *</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            required
            placeholder="Partagez votre expérience avec nos produits ou nos formations…"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-gold/30 focus:border-bakery-gold transition-colors resize-none"
          />
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !name.trim() || !text.trim()}
          className="w-full bg-bakery-black text-white py-4 rounded-full font-medium hover:bg-stone-800 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {status === "loading" ? "Envoi en cours…" : "Envoyer mon avis"}
        </button>

        <p className="text-center text-xs text-stone-400">
          Votre avis sera publié après validation par notre équipe.
        </p>
      </form>
    </div>
  );
}
