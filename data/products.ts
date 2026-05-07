// ============================================================
// CATALOGUE PRODUITS
// Ajoutez, modifiez ou supprimez des produits ici
// stripeProductId: créez le produit dans votre dashboard Stripe
//   et copiez l'ID du prix (commence par "price_")
// ============================================================

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // en euros
  category: "pain" | "viennoiserie" | "patisserie" | "cookies" | "special";
  image: string;
  rating: number; // de 1 à 5
  reviewCount: number;
  inStock: boolean;
  bestseller?: boolean;
  stripeProductId?: string; // Remplissez avec votre ID Stripe (ex: "price_1OxxxxxxxxxxxYYY")
};

export const products: Product[] = [
  {
    id: "croissant-beurre",
    name: "Croissant au Beurre",
    description: "Feuilleté doré, croustillant à l'extérieur et fondant à l'intérieur. Fait avec du beurre AOP de qualité supérieure.",
    price: 2.5,
    category: "viennoiserie",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 248,
    inStock: true,
    bestseller: true,
    stripeProductId: "", // À remplir avec votre ID de prix Stripe
  },
  {
    id: "pain-campagne",
    name: "Pain de Campagne",
    description: "Pain rustique à la mie dense et à la croûte épaisse. Fermentation longue pour un goût authentique.",
    price: 4.9,
    category: "pain",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    bestseller: true,
    stripeProductId: "",
  },
  {
    id: "muffin-chocolat",
    name: "Muffin Chocolat Pécan",
    description: "Muffin moelleux avec des pépites de chocolat noir et des éclats de noix de pécan grillées.",
    price: 3.5,
    category: "patisserie",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 186,
    inStock: true,
    bestseller: true,
    stripeProductId: "",
  },
  {
    id: "pain-levain",
    name: "Pain au Levain",
    description: "Pain au levain naturel, fermenté 24h pour une digestibilité optimale et un arôme complexe.",
    price: 6.5,
    category: "pain",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 204,
    inStock: true,
    bestseller: true,
    stripeProductId: "",
  },
  {
    id: "cookie-choco",
    name: "Cookie Chocolat Noir",
    description: "Cookie croustillant aux bords et fondant au centre, chargé de chunks de chocolat noir 70%.",
    price: 2.9,
    category: "cookies",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    rating: 5.0,
    reviewCount: 421,
    inStock: true,
    stripeProductId: "",
  },
  {
    id: "baguette-tradition",
    name: "Baguette Tradition",
    description: "Notre baguette phare, labellisée artisanale. Pâte fermentée 12h minimum, cuite sur sole de pierre.",
    price: 1.5,
    category: "pain",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 632,
    inStock: true,
    stripeProductId: "",
  },
  {
    id: "pain-chocolat",
    name: "Pain au Chocolat",
    description: "Viennoiserie feuilletée garnie de deux barres de chocolat noir fondant. Le classique incontournable.",
    price: 2.8,
    category: "viennoiserie",
    image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 389,
    inStock: true,
    stripeProductId: "",
  },
  {
    id: "tarte-citron",
    name: "Tarte Citron Meringuée",
    description: "Fond de tarte sablé, crème au citron acidulée et meringue italienne légèrement brûlée.",
    price: 5.5,
    category: "patisserie",
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 143,
    inStock: true,
    stripeProductId: "",
  },
  {
    id: "boite-viennoiseries",
    name: "Box Viennoiseries (6 pcs)",
    description: "Assortiment de 6 viennoiseries : 2 croissants, 2 pains au chocolat, 1 pain aux raisins, 1 brioche.",
    price: 14.9,
    category: "special",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 97,
    inStock: true,
    stripeProductId: "",
  },
];

export const productCategories = [
  { id: "all", label: "Tout voir" },
  { id: "pain", label: "Pains" },
  { id: "viennoiserie", label: "Viennoiseries" },
  { id: "patisserie", label: "Pâtisseries" },
  { id: "cookies", label: "Cookies" },
  { id: "special", label: "Coffrets" },
];
