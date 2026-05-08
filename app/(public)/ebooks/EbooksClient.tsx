'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Download, Check, ShoppingBag, Star } from 'lucide-react'
import type { Formation } from '@/data/formations'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

export default function EbooksClient({ ebooks }: { ebooks: Formation[] }) {
  return (
    <>
      <div className="page-header text-center">
        <div className="inline-flex items-center gap-2 bg-white text-bakery-black text-sm px-4 py-1.5 rounded-full font-medium shadow-sm mb-5">
          <BookOpen className="w-4 h-4 text-bakery-gold" />
          Téléchargement instantané · Format PDF
        </div>
        <h1 className="section-title mb-3">Ebooks & Guides PDF</h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Des guides complets rédigés par nos experts boulangers. Téléchargez et consultez sur tous vos appareils.
        </p>
      </div>

      <div className="bg-white py-10 border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Download, title: 'Téléchargement immédiat', desc: 'Accès instantané après paiement' },
              { icon: BookOpen, title: 'PDF haute qualité', desc: 'Compatible tous appareils & imprimable' },
              { icon: Check, title: 'Mises à jour gratuites', desc: 'Le guide évolue, vous en profitez' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-peach-100 rounded-2xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-bakery-brown" />
                </div>
                <h3 className="font-semibold text-bakery-black">{title}</h3>
                <p className="text-stone-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ebooks.map((ebook) => (
            <EbookCard key={ebook.id} ebook={ebook} />
          ))}
        </div>
      </div>
    </>
  )
}

function EbookCard({ ebook }: { ebook: Formation }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      id: ebook.id,
      name: ebook.name,
      price: ebook.price,
      quantity: 1,
      image: ebook.image,
      type: 'ebook',
      stripeProductId: ebook.stripeProductId,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="card flex flex-col overflow-hidden group">
      <Link href={`/ebooks/${ebook.id}`} className="relative aspect-video overflow-hidden bg-peach-100 block">
        <Image
          src={ebook.image}
          alt={ebook.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="bg-white/90 text-bakery-black text-xs px-2.5 py-1 rounded-full font-medium">
            📄 {ebook.pages} pages
          </span>
          {ebook.bestseller && (
            <span className="bg-bakery-gold text-white text-xs px-2.5 py-1 rounded-full font-medium">
              Bestseller
            </span>
          )}
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <Link href={`/ebooks/${ebook.id}`}>
          <h3 className="font-serif text-xl font-bold text-bakery-black mb-2 hover:text-stone-600 transition-colors">{ebook.name}</h3>
        </Link>
        <p className="text-stone-500 text-sm leading-relaxed mb-4 flex-1">{ebook.shortDescription}</p>

        <ul className="space-y-1.5 mb-5">
          {ebook.includes.map((inc) => (
            <li key={inc} className="flex items-center gap-2 text-sm text-stone-600">
              <Check className="w-4 h-4 text-green-500 shrink-0" />
              {inc}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-4 h-4 fill-bakery-gold text-bakery-gold" />
          ))}
          <span className="text-sm text-stone-500 ml-1">({ebook.reviewCount} avis)</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-bold text-2xl text-bakery-black">
              {ebook.price.toFixed(2).replace('.', ',')} €
            </span>
            {ebook.originalPrice && (
              <span className="text-stone-400 text-sm line-through ml-2">
                {ebook.originalPrice.toFixed(2).replace('.', ',')} €
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-bakery-black text-white hover:bg-stone-700 hover:scale-105'
            }`}
          >
            {added ? (
              <><Check className="w-4 h-4" /> Ajouté !</>
            ) : (
              <><ShoppingBag className="w-4 h-4" /> Acheter</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
