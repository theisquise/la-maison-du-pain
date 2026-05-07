import { getProducts } from '@/lib/admin-data'
import { productCategories } from '@/data/products'
import BoutiqueClient from './BoutiqueClient'

export const dynamic = 'force-dynamic'

export default function BoutiquePage() {
  const products = getProducts()
  return <BoutiqueClient products={products} categories={productCategories} />
}
