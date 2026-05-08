import { siteConfig } from "@/data/site-config";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site La Maison du Pain.",
};

export default function MentionsLegalesPage() {
  const { contact } = siteConfig;

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl font-bold text-bakery-black mb-2">Mentions légales</h1>
        <p className="text-stone-500 mb-12">Conformément aux articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004.</p>

        <div className="space-y-10 text-stone-700 leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">1. Éditeur du site</h2>
            <p>Le présent site est édité par :</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li><strong>Dénomination :</strong> {siteConfig.name}</li>
              <li><strong>Adresse :</strong> {contact.address}</li>
              <li><strong>Téléphone :</strong> {contact.phone}</li>
              <li><strong>Email :</strong> {contact.email}</li>
              <li><strong>Forme juridique :</strong> [Forme juridique — ex : SARL, Auto-entrepreneur…]</li>
              <li><strong>SIRET :</strong> [Numéro SIRET]</li>
              <li><strong>Numéro TVA intracommunautaire :</strong> [Numéro TVA ou N/A]</li>
            </ul>
            <p className="mt-2 text-sm text-stone-500">Directeur de la publication : [Nom du responsable]</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">2. Hébergement</h2>
            <p className="text-sm">
              Le site est hébergé par <strong>Railway</strong> (Railway Corp., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis).
              Les données sont stockées sur des serveurs situés dans l&apos;Union Européenne.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">3. Propriété intellectuelle</h2>
            <p className="text-sm">
              L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, icônes) est protégé par le droit d&apos;auteur.
              Toute reproduction, même partielle, est interdite sans autorisation préalable écrite de l&apos;éditeur.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">4. Protection des données personnelles (RGPD)</h2>
            <p className="text-sm mb-2">
              Les données collectées sur ce site (nom, email, adresse) sont utilisées uniquement dans le cadre du traitement
              de vos commandes et, avec votre consentement, pour l&apos;envoi de notre newsletter.
            </p>
            <p className="text-sm mb-2">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
              vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données.
            </p>
            <p className="text-sm">
              Pour exercer ces droits, contactez-nous à : <a href={`mailto:${contact.email}`} className="underline hover:text-bakery-black">{contact.email}</a>.
              Délai de réponse : 30 jours maximum.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">5. Cookies</h2>
            <p className="text-sm">
              Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement (panier, session).
              Aucun cookie publicitaire ou de traçage tiers n&apos;est déposé sans votre consentement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-bakery-black mb-3">6. Médiation</h2>
            <p className="text-sm">
              En cas de litige, vous pouvez recourir à la médiation de la consommation.
              Plateforme européenne de résolution en ligne des litiges :{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline hover:text-bakery-black">
                ec.europa.eu/consumers/odr
              </a>.
            </p>
          </section>

        </div>

        <p className="text-stone-400 text-xs mt-16">Dernière mise à jour : mai 2025</p>
      </div>
    </div>
  );
}
