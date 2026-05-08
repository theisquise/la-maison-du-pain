"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

function ConnexionForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(
    errorParam === "lien-expire"
      ? "Ce lien de connexion a expiré. Demandez-en un nouveau."
      : errorParam === "lien-invalide"
      ? "Lien invalide. Demandez-en un nouveau."
      : ""
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await fetch("/api/customer/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-bakery-black mb-2">Email envoyé !</h2>
        <p className="text-stone-500 mb-2">
          Si un compte existe pour <strong>{email}</strong>, vous allez recevoir un lien de connexion.
        </p>
        <p className="text-stone-400 text-sm">Vérifiez aussi vos spams. Le lien est valable 30 minutes.</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-bakery-black mb-2">Mon espace client</h1>
        <p className="text-stone-500">
          Entrez votre email pour recevoir un lien de connexion.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-bakery-black mb-1.5">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              autoFocus
              className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bakery-black/10 focus:border-bakery-black transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Envoi…" : "Recevoir mon lien de connexion"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-center text-stone-400 text-sm mt-6">
        Vous n'avez pas encore de compte ?{" "}
        <Link href="/boutique" className="underline hover:text-bakery-black transition-colors">
          Faites votre premier achat
        </Link>
      </p>
    </>
  );
}

export default function ConnexionPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="h-64 animate-pulse bg-stone-100 rounded-2xl" />}>
          <ConnexionForm />
        </Suspense>
      </div>
    </div>
  );
}
