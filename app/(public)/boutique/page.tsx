import { getProducts } from '@/lib/admin-data'
import { productCategories } from '@/data/products'
import BoutiqueClient from './BoutiqueClient'

export const revalidate = 30

export default function BoutiquePage() {
  const products = getProducts()
  return <BoutiqueClient products={products} categories={productCategories} />
}
