"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, Mail, ArrowRight, PartyPopper } from "lucide-react";
import { useCart } from "@/lib/cart-context";

function SuccesContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [clearCart, cleared]);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/order?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => setTypes(d.types || ["product"]))
      .catch(() => setTypes(["product"]));
  }, [sessionId]);

  const hasPhysical = types.length === 0 || types.includes("product");
  const hasDigital = types.includes("formation") || types.includes("ebook");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
              <PartyPopper className="w-8 h-8 text-bakery-gold" />
            </div>
          </div>
        </div>

        <h1 className="font-serif text-4xl font-bold text-bakery-black mb-3">
          Merci pour votre commande !
        </h1>
        <p className="text-stone-500 text-lg mb-8">
          Votre paiement a été confirmé. Vous allez recevoir un email de confirmation sous quelques minutes.
        </p>

        <div className="bg-stone-50 rounded-2xl p-6 mb-8 text-left space-y-4">
          <h3 className="font-semibold text-bakery-black mb-3 text-center">Prochaines étapes</h3>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-600 font-bold text-sm">1</div>
            <div>
              <p className="font-medium text-bakery-black text-sm">Email de confirmation</p>
              <p className="text-stone-400 text-xs">Vérifiez votre boîte mail (et les spams)</p>
            </div>
          </div>

          {hasDigital && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-blue-600 font-bold text-sm">2</div>
              <div>
                <p className="font-medium text-bakery-black text-sm flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  {types.includes("ebook") && types.includes("formation") ? "Ebooks & formations" : types.includes("ebook") ? "Votre ebook" : "Votre formation"}
                </p>
                <p className="text-stone-400 text-xs">Lien de téléchargement dans l'email de confirmation</p>
              </div>
            </div>
          )}

          {hasPhysical && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-peach-200 rounded-full flex items-center justify-center shrink-0 text-bakery-brown font-bold text-sm">{hasDigital ? "3" : "2"}</div>
              <div>
                <p className="font-medium text-bakery-black text-sm flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Livraison de votre commande
                </p>
                <p className="text-stone-400 text-xs">Livraison en 24-48h ouvrés, suivi par email</p>
              </div>
            </div>
          )}
        </div>

        {sessionId && (
          <p className="text-stone-300 text-xs mb-6">
            Référence de commande : <span className="font-mono">{sessionId.slice(0, 20)}…</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {hasDigital && (
            <Link href="/mon-compte" className="btn-primary">
              Accéder à mes achats
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link href="/boutique" className={hasDigital ? "btn-outline" : "btn-primary"}>
            Continuer mes achats
            {!hasDigital && <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>

        <p className="text-stone-400 text-sm mt-6">
          Un problème ?{" "}
          <Link href="/contact" className="underline hover:text-bakery-black transition-colors">
            Contactez-nous
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SuccesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-bakery-black/20 border-t-bakery-black rounded-full animate-spin" />
      </div>
    }>
      <SuccesContent />
    </Suspense>
  );
}
