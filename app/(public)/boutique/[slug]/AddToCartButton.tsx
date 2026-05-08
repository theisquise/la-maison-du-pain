'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/data/products'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      type: 'product',
      stripeProductId: product.stripeProductId,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  if (!product.inStock) {
    return (
      <button disabled className="w-full py-4 rounded-full bg-stone-200 text-stone-400 font-medium cursor-not-allowed">
        Rupture de stock
      </button>
    )
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
          <ShoppingBag className="w-5 h-5" />
          Ajouter au panier — {product.price.toFixed(2).replace('.', ',')} €
        </>
      )}
    </button>
  )
}
