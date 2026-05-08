'use client'

import { useState } from 'react'
import { Video, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import type { Formation } from '@/data/formations'

export default function FormationAddToCartButton({ formation }: { formation: Formation }) {
  const { addItem, openCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({
      id: formation.id,
      name: formation.name,
      price: formation.price,
      quantity: 1,
      image: formation.image,
      type: 'formation',
      stripeProductId: formation.stripeProductId,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-4 rounded-full font-medium text-base flex items-center justify-center gap-2 transition-all duration-200 ${
        added
          ? 'bg-green-500 text-white scale-95'
          : 'bg-bakery-black text-white hover:bg-stone-800 hover:scale-[1.02]'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Ajouté au panier !
        </>
      ) : (
        <>
          <Video className="w-5 h-5" />
          S'inscrire — {formation.price.toFixed(2).replace('.', ',')} €
        </>
      )}
    </button>
  )
}
