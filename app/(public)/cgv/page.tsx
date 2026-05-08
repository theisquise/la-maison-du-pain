import { siteConfig } from "@/data/site-config";

export const metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions Générales de Vente de La Maison du Pain.",
};

export default function CGVPage() {
  const { contact } = siteConfig;

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl font-bold text-bakery-black mb-2">Conditions Générales de Vente</h1>
        <p className="text-stone-500 mb-12">En vigueur au 1er mai 2025 — applicables à toute commande passée sur ce site.</p>

        <div className="space-y-10 text-stone-700 leading-relaxed text-sm">

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 1 — Identification du vendeur</h2>
            <p>
              {siteConfig.name}, [Forme juridique], dont le siège social est situé au {contact.address}.
              Email : {contact.email} — Téléphone : {contact.phone}.
              SIRET : [Numéro SIRET] — [Numéro TVA intracommunautaire ou mention non assujetti].
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 2 — Champ d&apos;application</h2>
            <p>
              Les présentes Conditions Générales de Vente s&apos;appliquent à toute commande passée sur le site
              par un consommateur (personne physique non professionnelle). Elles prévalent sur tout autre document.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 3 — Produits</h2>
            <p className="mb-2">
              Le site propose trois catégories de produits :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Produits physiques</strong> : pains, viennoiseries et produits artisanaux livrés à domicile.</li>
              <li><strong>Formations en ligne</strong> : accès à des vidéos pédagogiques, permanent et personnel.</li>
              <li><strong>Ebooks PDF</strong> : fichiers numériques téléchargeables immédiatement après paiement.</li>
            </ul>
            <p className="mt-2">
              Les photographies et descriptions sont données à titre indicatif. Les produits artisanaux peuvent présenter
              de légères variations (aspect, poids) sans que cela constitue un défaut.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 4 — Prix</h2>
            <p>
              Les prix sont indiqués en euros TTC. Le vendeur se réserve le droit de modifier ses prix à tout moment,
              le prix applicable étant celui en vigueur au moment de la commande.
              Les frais de livraison sont indiqués avant validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 5 — Commandes</h2>
            <p className="mb-2">
              La commande est validée après paiement complet. Un email de confirmation est envoyé à l&apos;adresse
              fournie lors de la commande, récapitulant les articles, le montant et les informations de livraison.
            </p>
            <p>
              Le vendeur se réserve le droit d&apos;annuler toute commande en cas de stock insuffisant, d&apos;erreur de prix
              manifeste ou de suspicion de fraude, avec remboursement intégral sous 14 jours.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 6 — Paiement</h2>
            <p>
              Le paiement est sécurisé via <strong>Stripe</strong> (TLS/SSL). Les moyens de paiement acceptés sont :
              carte bancaire (Visa, Mastercard, American Express). Le débit est effectué au moment de la validation
              de la commande. Les données bancaires ne transitent pas par nos serveurs.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 7 — Livraison (produits physiques)</h2>
            <p className="mb-2">
              Les délais de livraison sont indiqués à titre indicatif et courent à compter de la confirmation du paiement.
              En cas de retard supérieur à 7 jours ouvrés, le client peut annuler la commande et obtenir un remboursement.
            </p>
            <p>
              Les produits voyage aux risques du vendeur. En cas de dommage à la livraison, le client dispose de 3 jours
              pour signaler le problème à {contact.email}.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 8 — Produits numériques</h2>
            <p>
              Les ebooks et formations sont accessibles immédiatement après paiement via l&apos;espace client.
              Le client reconnaît expressément renoncer à son droit de rétractation pour les contenus numériques
              dont l&apos;exécution a commencé avec son accord (conformément à l&apos;article L221-28 du Code de la consommation).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 9 — Droit de rétractation (produits physiques)</h2>
            <p className="mb-2">
              Pour les produits physiques non alimentaires, le client dispose de <strong>14 jours</strong> à compter
              de la réception pour exercer son droit de rétractation, sans motif ni pénalité (article L221-18 du Code de la consommation).
            </p>
            <p className="mb-2">
              <strong>Exception :</strong> les denrées alimentaires périssables (pains, viennoiseries) sont exclues
              du droit de rétractation (article L221-28, 3°).
            </p>
            <p>
              Pour exercer ce droit, contactez-nous à {contact.email}. Le remboursement est effectué dans un délai de 14 jours
              après réception du retour.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 10 — Garanties</h2>
            <p>
              Tous nos produits bénéficient de la garantie légale de conformité (articles L217-4 et suivants du Code de la consommation)
              et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 11 — Données personnelles</h2>
            <p>
              Les données collectées sont traitées conformément au RGPD et à notre politique de confidentialité
              accessible dans nos <a href="/mentions-legales" className="underline hover:text-bakery-black">mentions légales</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">Article 12 — Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, et après tentative de résolution
              amiable, les tribunaux compétents sont ceux du ressort de {contact.address.split(",").pop()?.trim() ?? "Paris"}.
            </p>
          </section>

        </div>

        <p className="text-stone-400 text-xs mt-16">Dernière mise à jour : mai 2025</p>
      </div>
    </div>
  );
}
