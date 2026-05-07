// ============================================================
// FICHIER DE CONFIGURATION PRINCIPALE DU SITE
// Modifiez ce fichier pour changer le contenu du site
// Aucune connaissance en code requise !
// ============================================================

export const siteConfig = {
  // --- IDENTITÉ DU SITE ---
  name: "La Maison du Pain",
  tagline: "Votre Dose Quotidienne de Fraîcheur",
  description: "Pains artisanaux et viennoiseries faites maison, formations professionnelles et ebooks de boulangerie.",
  logo: "/images/logo.png", // Remplacez par votre logo

  // --- COORDONNÉES ---
  contact: {
    address: "12 Rue de la Boulangerie, 75001 Paris",
    phone: "+33 1 23 45 67 89",
    email: "contact@lamaisondupain.fr",
  },

  // --- HORAIRES D'OUVERTURE ---
  hours: {
    lundi: "7h00 - 19h30",
    mardi: "7h00 - 19h30",
    mercredi: "7h00 - 19h30",
    jeudi: "7h00 - 19h30",
    vendredi: "7h00 - 19h30",
    samedi: "7h00 - 18h00",
    dimanche: "8h00 - 13h00",
  },

  // --- RÉSEAUX SOCIAUX ---
  social: {
    facebook: "https://facebook.com/votreboulangerie",
    instagram: "https://instagram.com/votreboulangerie",
    twitter: "https://twitter.com/votreboulangerie",
    tiktok: "https://tiktok.com/@votreboulangerie",
    youtube: "https://youtube.com/@votreboulangerie",
  },

  // --- PAGE D'ACCUEIL : SECTION HÉRO ---
  hero: {
    heading: "Votre Dose Quotidienne de Fraîcheur",
    subheading: "Pains artisanaux et viennoiseries faites maison depuis 1987",
    badgeText: "COMMANDER • LIVRAISON • CLICK & COLLECT •",
    ctaText: "Commander maintenant",
    ctaLink: "/boutique",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&h=700&fit=crop",
  },

  // --- SECTION TRADITION ---
  tradition: {
    heading: "La Tradition Rencontre le Goût",
    text: "Nous sommes une boulangerie familiale dédiée à la création de produits boulangers délicieux à partir des meilleurs ingrédients. Notre passion pour la boulangerie se retrouve dans chaque bouchée. En utilisant uniquement les meilleurs ingrédients, nous nous efforçons de créer une expérience gustative à la fois réconfortante et inoubliable.",
    ctaText: "Commander maintenant",
    ctaLink: "/boutique",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=500&fit=crop",
  },

  // --- SECTION SOMBRE (COOKIES) ---
  darkSection: {
    heading: "Délicieux Cookies",
    text: "Des cookies croustillants fourrés de chocolat riche. Notre boulangerie chaleureuse emplit l'air de l'arôme des pains fraîchement cuits. Nous croyons que chaque bouchée doit être une expérience délicieuse.",
    price: "5,90 €",
    ctaText: "Commander maintenant",
    ctaLink: "/boutique?categorie=cookies",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&h=500&fit=crop",
  },

  // --- SECTION FORMATIONS ---
  formationsSection: {
    heading: "Apprenez l'Art de la Boulangerie",
    subheading: "Formations professionnelles & Ebooks",
    text: "De débutant à expert, nos formations en ligne et nos ebooks vous guident pas à pas dans les secrets de la boulangerie artisanale et de la viennoiserie française.",
  },

  // --- NEWSLETTER ---
  newsletter: {
    heading: "Offres Exclusives & Nouvelles Annonces",
    subheading: "Inscrivez-vous pour recevoir nos offres, recettes et actualités en avant-première.",
    placeholder: "Votre adresse email",
    ctaText: "S'inscrire",
  },

  // --- FOOTER ---
  footer: {
    copyright: "© 2024 La Maison du Pain. Tous droits réservés.",
    paymentText: "Paiement 100% sécurisé",
  },
};

// --- NAVIGATION ---
export const navigation = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Boutique", href: "/boutique" },
  { label: "Formations", href: "/formations" },
  { label: "Ebooks", href: "/ebooks" },
  { label: "Contact", href: "/contact" },
];
