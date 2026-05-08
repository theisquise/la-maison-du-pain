import { MetadataRoute } from "next";
import { getProducts, getFormations } from "@/lib/admin-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.boulangerie-alex.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getProducts();
  const formations = getFormations();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1, changeFrequency: "weekly" },
    { url: `${SITE_URL}/boutique`, priority: 0.9, changeFrequency: "daily" },
    { url: `${SITE_URL}/formations`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/ebooks`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/a-propos`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${SITE_URL}/contact`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${SITE_URL}/laisser-un-avis`, priority: 0.4, changeFrequency: "monthly" },
  ];

  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.inStock)
    .map((p) => ({
      url: `${SITE_URL}/boutique/${p.id}`,
      priority: p.bestseller ? 0.8 : 0.7,
      changeFrequency: "weekly" as const,
    }));

  const formationPages: MetadataRoute.Sitemap = formations
    .filter((f) => f.type === "formation")
    .map((f) => ({
      url: `${SITE_URL}/formations/${f.id}`,
      priority: f.bestseller ? 0.8 : 0.7,
      changeFrequency: "monthly" as const,
    }));

  const ebookPages: MetadataRoute.Sitemap = formations
    .filter((f) => f.type === "ebook")
    .map((f) => ({
      url: `${SITE_URL}/ebooks/${f.id}`,
      priority: f.bestseller ? 0.8 : 0.7,
      changeFrequency: "monthly" as const,
    }));

  return [...staticPages, ...productPages, ...formationPages, ...ebookPages];
}
