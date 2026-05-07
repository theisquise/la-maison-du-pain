import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, ShieldCheck, Clock, Leaf } from 'lucide-react'
import { getProducts } from '@/lib/admin-data'
import { productCategories } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import AddToCartButton from './AddToCartButton'

export const revalidate = 30

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProducts().find((p) => p.id === params.slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
  }
}

const categoryLabel = (cat: string) =>
  productCategories.find((c) => c.id === cat)?.label ?? cat

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${s <= Math.round(rating) ? 'fill-bakery-gold text-bakery-gold' : 'text-stone-200'}`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-bakery-black">{rating.toFixed(1)}</span>
      <span className="text-sm text-stone-400">({count} avis)</span>
    </div>
  )
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const products = getProducts()
  const product = products.find((p) => p.id === params.slug)
  if (!product) notFound()

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm text-stone-400">
          <Link href="/" className="hover:text-bakery-black transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/boutique" className="hover:text-bakery-black transition-colors">Boutique</Link>
          <span>/</span>
          <span className="text-bakery-black font-medium">{product.name}</span>
        </div>
      </div>

      {/* Produit */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-peach-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.bestseller && (
              <div className="absolute top-5 left-5">
                <span className="bg-bakery-black text-white text-sm px-4 py-1.5 rounded-full font-medium">
                  ⭐ Bestseller
                </span>
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-bakery-black font-semibold px-6 py-3 rounded-full">
                  Rupture de stock
                </span>
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-sm font-medium text-bakery-gold uppercase tracking-wider">
                {categoryLabel(product.category)}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-bakery-black mt-2 leading-tight">
                {product.name}
              </h1>
            </div>

            <StarRating rating={product.rating} count={product.reviewCount} />

            {/* Prix */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-bakery-black">
                {product.price.toFixed(2).replace('.', ',')} €
              </span>
              {'originalPrice' in product && (product as { originalPrice?: number }).originalPrice && (
                <span className="text-xl text-stone-400 line-through">
                  {((product as { originalPrice?: number }).originalPrice!).toFixed(2).replace('.', ',')} €
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-stone-600 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Badges confiance */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-4 text-center shadow-sm">
                <Clock className="w-5 h-5 text-bakery-gold" />
                <span className="text-xs font-medium text-stone-600">Fait ce matin</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-4 text-center shadow-sm">
                <Leaf className="w-5 h-5 text-bakery-gold" />
                <span className="text-xs font-medium text-stone-600">Ingrédients naturels</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-4 text-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-bakery-gold" />
                <span className="text-xs font-medium text-stone-600">Paiement sécurisé</span>
              </div>
            </div>

            {/* Bouton */}
            <AddToCartButton product={product} />

            {/* Retour */}
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-bakery-black transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-serif text-3xl font-bold text-bakery-black mb-8">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} item={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
