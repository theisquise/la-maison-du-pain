// ============================================================
// FORMATIONS & EBOOKS
// Ajoutez vos formations et ebooks ici
// Pour les formations en ligne : type: "formation"
// Pour les livres numériques : type: "ebook"
// downloadUrl: lien de téléchargement pour les ebooks
//   (ex: Google Drive, Dropbox, votre propre hébergement)
// ============================================================

export type Formation = {
  id: string;
  type: "formation" | "ebook";
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  originalPrice?: number; // Prix barré si promotion
  image: string;
  level: "débutant" | "intermédiaire" | "avancé";
  duration?: string; // Pour formations : "12h de vidéos"
  pages?: number; // Pour ebooks : nombre de pages
  includes: string[]; // Ce qui est inclus
  rating: number;
  reviewCount: number;
  bestseller?: boolean;
  stripeProductId?: string; // ID de prix Stripe
  downloadUrl?: string; // URL de téléchargement ebook (après paiement)
};

export const formations: Formation[] = [
  // ==================== FORMATIONS ====================
  {
    id: "formation-viennoiserie-debutant",
    type: "formation",
    name: "Viennoiserie de A à Z",
    shortDescription: "Maîtrisez l'art du croissant et de la viennoiserie feuilletée.",
    longDescription: "Cette formation complète vous guide pas à pas dans les techniques fondamentales de la viennoiserie française. Du feuilletage au façonnage, apprenez à réaliser des croissants dignes d'un boulanger professionnel.",
    price: 97,
    originalPrice: 147,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop",
    level: "débutant",
    duration: "8h de vidéos HD",
    includes: [
      "8h de vidéos HD téléchargeables",
      "Fiches recettes PDF imprimables",
      "Groupe privé d'entraide",
      "Accès à vie + mises à jour",
      "Certificat de completion",
    ],
    rating: 4.9,
    reviewCount: 312,
    bestseller: true,
    stripeProductId: "", // À remplir
  },
  {
    id: "formation-pain-artisanal",
    type: "formation",
    name: "Pain Artisanal & Levain",
    shortDescription: "Créez votre levain naturel et maîtrisez les pains artisanaux.",
    longDescription: "Plongez dans l'univers fascinant du pain au levain naturel. De la création de votre starter à la cuisson sur sole, cette formation vous révèle tous les secrets des boulangers artisanaux.",
    price: 127,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
    level: "intermédiaire",
    duration: "12h de vidéos HD",
    includes: [
      "12h de vidéos HD téléchargeables",
      "Guide du levain naturel (PDF 80 pages)",
      "Calendrier de fermentation",
      "Groupe privé d'entraide",
      "Accès à vie + mises à jour",
      "Certificat de completion",
    ],
    rating: 4.8,
    reviewCount: 189,
    stripeProductId: "",
  },
  {
    id: "formation-patisserie-boutique",
    type: "formation",
    name: "Pâtisserie Boutique",
    shortDescription: "Tartes, éclairs, macarons : les classiques de la pâtisserie française.",
    longDescription: "Apprenez à réaliser les grandes classiques de la pâtisserie française. Des techniques de base aux finitions professionnelles, cette formation vous prépare à régaler votre entourage ou à vous lancer.",
    price: 147,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&h=400&fit=crop",
    level: "intermédiaire",
    duration: "15h de vidéos HD",
    includes: [
      "15h de vidéos HD téléchargeables",
      "Recettes exclusives (50 recettes)",
      "Techniques de décoration",
      "Groupe privé d'entraide",
      "Accès à vie + mises à jour",
      "Certificat de completion",
    ],
    rating: 4.9,
    reviewCount: 156,
    stripeProductId: "",
  },
  {
    id: "formation-ouvrir-boulangerie",
    type: "formation",
    name: "Ouvrir sa Boulangerie",
    shortDescription: "De la passion au business : comment lancer votre boulangerie artisanale.",
    longDescription: "Vous rêvez d'ouvrir votre propre boulangerie ? Cette formation vous accompagne sur tous les aspects : business plan, réglementation, équipement, recrutement et marketing pour lancer votre activité avec succès.",
    price: 297,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&h=400&fit=crop",
    level: "avancé",
    duration: "20h de contenu",
    includes: [
      "20h de vidéos et modules",
      "Templates business plan",
      "Check-lists réglementaires",
      "Calculateurs de coûts",
      "1 session coaching individuel (1h)",
      "Accès à vie + mises à jour",
      "Certificat de completion",
    ],
    rating: 5.0,
    reviewCount: 78,
    stripeProductId: "",
  },

  // ==================== EBOOKS ====================
  {
    id: "ebook-100-recettes",
    type: "ebook",
    name: "100 Recettes de Boulangerie",
    shortDescription: "Le guide complet des recettes de boulangerie artisanale française.",
    longDescription: "100 recettes détaillées avec photos, de la baguette au pain de mie, en passant par les viennoiseries et les pains spéciaux. Un livre de référence pour tous les niveaux.",
    price: 24.9,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
    level: "débutant",
    pages: 210,
    includes: [
      "210 pages en PDF haute qualité",
      "100 recettes avec photos",
      "Index des techniques",
      "Tableaux de conversion",
      "Téléchargement immédiat",
    ],
    rating: 4.8,
    reviewCount: 445,
    bestseller: true,
    stripeProductId: "",
    downloadUrl: "", // Mettez votre lien de téléchargement ici
  },
  {
    id: "ebook-guide-levain",
    type: "ebook",
    name: "Guide Complet du Levain",
    shortDescription: "Créez, entretenez et utilisez votre levain naturel comme un pro.",
    longDescription: "Tout ce que vous devez savoir sur le levain naturel : création, entretien, diagnostic des problèmes et utilisation dans vos recettes. Le guide de référence incontournable.",
    price: 14.9,
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop",
    level: "débutant",
    pages: 85,
    includes: [
      "85 pages en PDF",
      "Calendrier d'entretien",
      "Guide de diagnostic",
      "10 recettes au levain",
      "Téléchargement immédiat",
    ],
    rating: 4.9,
    reviewCount: 287,
    stripeProductId: "",
    downloadUrl: "",
  },
  {
    id: "ebook-viennoiserie-secrets",
    type: "ebook",
    name: "Secrets de la Viennoiserie",
    shortDescription: "Les techniques professionnelles du feuilletage révélées.",
    longDescription: "Comprenez la science derrière le feuilletage et maîtrisez toutes les techniques pour réaliser des viennoiseries parfaites à la maison. Avec des explications détaillées et des photos étape par étape.",
    price: 19.9,
    image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=600&h=400&fit=crop",
    level: "intermédiaire",
    pages: 120,
    includes: [
      "120 pages en PDF haute qualité",
      "Photos étape par étape",
      "Fiches techniques",
      "Tableau des temperatures",
      "Téléchargement immédiat",
    ],
    rating: 4.7,
    reviewCount: 198,
    stripeProductId: "",
    downloadUrl: "",
  },
];

export const formationCategories = [
  { id: "all", label: "Tout voir" },
  { id: "formation", label: "Formations vidéo" },
  { id: "ebook", label: "Ebooks PDF" },
];

export const levelLabels = {
  débutant: { label: "Débutant", color: "bg-green-100 text-green-800" },
  intermédiaire: { label: "Intermédiaire", color: "bg-yellow-100 text-yellow-800" },
  avancé: { label: "Avancé", color: "bg-red-100 text-red-800" },
};
