import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, CheckCircle2, BookOpen, Download, RefreshCw } from 'lucide-react'
import { getFormations } from '@/lib/admin-data'
import { levelLabels } from '@/data/formations'
import ProductCard from '@/components/ProductCard'
import EbookAddToCartButton from './AddToCartButton'

export const revalidate = 30

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const ebook = getFormations().find((f) => f.id === params.slug && f.type === 'ebook')
  if (!ebook) return {}
  return { title: ebook.name, description: ebook.shortDescription }
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'fill-bakery-gold text-bakery-gold' : 'text-stone-200'}`} />
        ))}
      </div>
      <span className="text-sm font-semibold text-bakery-black">{rating.toFixed(1)}</span>
      <span className="text-sm text-stone-400">({count} avis)</span>
    </div>
  )
}

export default function EbookPage({ params }: { params: { slug: string } }) {
  const formations = getFormations()
  const ebook = formations.find((f) => f.id === params.slug && f.type === 'ebook')
  if (!ebook) notFound()

  const level = levelLabels[ebook.level]
  const related = formations
    .filter((f) => f.type === 'ebook' && f.id !== ebook.id)
    .slice(0, 3)

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm text-stone-400">
          <Link href="/" className="hover:text-bakery-black transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/ebooks" className="hover:text-bakery-black transition-colors">Ebooks</Link>
          <span>/</span>
          <span className="text-bakery-black font-medium">{ebook.name}</span>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-peach-100">
            <Image src={ebook.image} alt={ebook.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            {ebook.bestseller && (
              <div className="absolute top-5 left-5">
                <span className="bg-bakery-black text-white text-sm px-4 py-1.5 rounded-full font-medium">⭐ Bestseller</span>
              </div>
            )}
            <div className="absolute bottom-5 left-5">
              <span className={`text-sm px-4 py-1.5 rounded-full font-medium ${level.color}`}>{level.label}</span>
            </div>
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-sm font-medium text-bakery-gold uppercase tracking-wider">Ebook PDF · {ebook.pages} pages</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-bakery-black mt-2 leading-tight">{ebook.name}</h1>
            </div>

            <StarRating rating={ebook.rating} count={ebook.reviewCount} />

            <p className="text-stone-600 text-lg leading-relaxed">{ebook.longDescription}</p>

            {/* Prix */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-bakery-black">{ebook.price.toFixed(2).replace('.', ',')} €</span>
              {ebook.originalPrice && (
                <span className="text-xl text-stone-400 line-through">{ebook.originalPrice.toFixed(2).replace('.', ',')} €</span>
              )}
            </div>

            {/* Ce qui est inclus */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <p className="font-semibold text-bakery-black mb-3">Ce qui est inclus :</p>
              <ul className="flex flex-col gap-2">
                {ebook.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-stone-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-4 text-center shadow-sm">
                <Download className="w-5 h-5 text-bakery-gold" />
                <span className="text-xs font-medium text-stone-600">Téléchargement immédiat</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-4 text-center shadow-sm">
                <BookOpen className="w-5 h-5 text-bakery-gold" />
                <span className="text-xs font-medium text-stone-600">Tous appareils</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-4 text-center shadow-sm">
                <RefreshCw className="w-5 h-5 text-bakery-gold" />
                <span className="text-xs font-medium text-stone-600">Mises à jour gratuites</span>
              </div>
            </div>

            <EbookAddToCartButton ebook={ebook} />

            <Link href="/ebooks" className="inline-flex items-center gap-2 text-stone-400 hover:text-bakery-black transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Retour aux ebooks
            </Link>
          </div>
        </div>
      </div>

      {/* Autres ebooks */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-serif text-3xl font-bold text-bakery-black mb-8">Autres ebooks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((f) => <ProductCard key={f.id} item={f} />)}
          </div>
        </div>
      )}
    </div>
  )
}
