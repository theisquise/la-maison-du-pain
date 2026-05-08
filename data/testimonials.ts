// ============================================================
// TÉMOIGNAGES CLIENTS
// Modifiez ou ajoutez des avis clients ici
// ============================================================

export type Testimonial = {
  id: string;
  name: string;
  role?: string; // "Cliente fidèle", "Boulanger amateur", etc.
  avatar?: string;
  text: string;
  rating: number;
  product?: string; // Produit acheté
  date?: string;
  pending?: boolean; // true = en attente de modération admin
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Leclerc",
    role: "Cliente fidèle depuis 3 ans",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "Le pain au levain est absolument divin. La mie alvéolée, la croûte croustillante… Je ne peux plus me passer de mes commandes hebdomadaires ! La formation levain m'a aussi permis de faire mon propre pain à la maison.",
    rating: 5,
    product: "Pain au Levain",
    date: "Novembre 2024",
  },
  {
    id: "2",
    name: "Thomas Martin",
    role: "Passionné de boulangerie",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "J'ai suivi la formation 'Viennoiserie de A à Z' et c'est une révélation. Mes croissants sont maintenant aussi bons que ceux d'une boulangerie professionnelle. Les explications sont claires, les vidéos de haute qualité. Je recommande vivement !",
    rating: 5,
    product: "Formation Viennoiserie de A à Z",
    date: "Octobre 2024",
  },
  {
    id: "3",
    name: "Marie Dupont",
    role: "Maman et passionnée de cuisine",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    text: "Les muffins chocolat pécan sont les meilleurs que j'aie jamais goûtés. Et le service est impeccable ! L'ebook '100 Recettes de Boulangerie' est aussi une pépite, avec des explications accessibles même pour les débutants.",
    rating: 5,
    product: "Muffin Chocolat Pécan + Ebook 100 Recettes",
    date: "Décembre 2024",
  },
  {
    id: "4",
    name: "Pierre Rousseau",
    role: "Boulanger amateur",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    text: "La qualité est au rendez-vous à chaque commande. Les croissants sont feuilletés à la perfection. J'ai aussi commandé l'ebook sur la viennoiserie et les techniques expliquées sont vraiment professionnelles.",
    rating: 5,
    product: "Croissant au Beurre",
    date: "Janvier 2025",
  },
  {
    id: "5",
    name: "Isabelle Chen",
    role: "Chef à domicile",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "Formation 'Pain Artisanal & Levain' terminée ! En 3 semaines j'ai réussi à créer mon premier levain qui tient la route et à faire de beaux pains. Le formateur explique tout avec patience. Merci !",
    rating: 5,
    product: "Formation Pain Artisanal & Levain",
    date: "Février 2025",
  },
];

// Image produit pour la section témoignages
export const testimonialsConfig = {
  heading: "Pourquoi Nos Clients Adorent La Maison du Pain",
  productImage: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=400&fit=crop",
};
