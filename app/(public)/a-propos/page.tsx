import Image from "next/image";
import Link from "next/link";
import { Heart, Wheat, Award, Users } from "lucide-react";

export const revalidate = 3600

export const metadata = {
  title: 'Notre Histoire',
  description: 'Depuis 1987, La Maison du Pain perpétue la tradition de la boulangerie artisanale française.',
}

const values = [
  {
    icon: Wheat,
    title: "Ingrédients de Qualité",
    desc: "Nous sélectionnons rigoureusement chaque ingrédient : farines biologiques de moulins locaux, beurre AOP, chocolat grand cru.",
  },
  {
    icon: Heart,
    title: "Fait avec Passion",
    desc: "Chaque produit est façonné à la main par nos artisans boulangers. La passion du métier se ressent dans chaque bouchée.",
  },
  {
    icon: Award,
    title: "Excellence Artisanale",
    desc: "Nos méthodes de fermentation longue et nos cuissons sur sole de pierre sont le garant d'une qualité professionnelle.",
  },
  {
    icon: Users,
    title: "Transmission du Savoir",
    desc: "Nous croyons au partage. Nos formations et ebooks permettent à chacun d'apprendre l'art de la boulangerie.",
  },
];

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <div className="page-header text-center">
        <h1 className="section-title mb-4">Notre Histoire</h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Depuis 1987, nous perpétuons la tradition de la boulangerie artisanale française avec passion et authenticité.
        </p>
      </div>

      {/* Histoire */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=700&h=500&fit=crop"
                alt="Notre boulangerie"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl font-bold text-bakery-black mb-6 leading-tight">
                La Tradition Rencontre la Modernité
              </h2>
              <div className="space-y-4 text-stone-600 text-lg leading-relaxed">
                <p>
                  Fondée en 1987 par Jean-Pierre et Marie Moreau, La Maison du Pain est née d'une passion simple : offrir à chacun un pain exceptionnel, fait avec des ingrédients de qualité et façonné à la main.
                </p>
                <p>
                  Aujourd'hui, nous perpétuons ces valeurs tout en embrassant le numérique pour partager notre savoir-faire avec le monde entier, à travers nos formations en ligne et nos ebooks.
                </p>
                <p>
                  Notre équipe de boulangers passionnés se lève chaque jour à 3h du matin pour que vous puissiez savourer des viennoiseries fraîches. Cette dévotion, nous voulons vous la transmettre.
                </p>
              </div>
              <Link href="/formations" className="btn-primary mt-8">
                Découvrir nos formations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-peach-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-14">Nos Valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-peach-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-bakery-brown" />
                </div>
                <h3 className="font-serif text-xl font-bold text-bakery-black mb-3">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-4">Notre Équipe</h2>
          <p className="text-stone-500 text-lg mb-14 max-w-xl mx-auto">
            Des artisans passionnés qui donnent le meilleur d'eux-mêmes chaque jour.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { name: "Jean-Pierre Moreau", role: "Fondateur & Maître Boulanger", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
              { name: "Sophie Laurent", role: "Chef Pâtissière", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" },
              { name: "Marc Dubois", role: "Formateur & Expert Levain", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face" },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-peach-200 ring-offset-4">
                  <Image src={member.img} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-serif font-bold text-xl text-bakery-black">{member.name}</h3>
                <p className="text-stone-400 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bakery-black py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Prêt à Apprendre ?</h2>
          <p className="text-stone-400 text-lg mb-8">
            Rejoignez plus de 2 400 élèves qui ont appris la boulangerie artisanale avec nous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formations" className="btn-primary bg-white text-bakery-black hover:bg-stone-100">
              Voir les formations
            </Link>
            <Link href="/boutique" className="btn-outline border-white text-white hover:bg-white hover:text-bakery-black">
              Commander en ligne
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
