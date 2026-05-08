import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { getProducts, saveProducts, type Product } from '@/lib/admin-data'

export async function GET() {
  const err = requireAdmin()
  if (err) return err
  return NextResponse.json(getProducts())
}

export async function POST(req: NextRequest) {
  const err = requireAdmin()
  if (err) return err

  try {
    const body = await req.json() as Partial<Product>
    const products = getProducts()

    const newProduct: Product = {
      id: slugify(body.name ?? '') + '-' + Date.now().toString(36),
      name: body.name ?? '',
      description: body.description ?? '',
      price: Number(body.price) || 0,
      category: body.category ?? 'pain',
      image: body.image ?? '',
      rating: Number(body.rating) || 5,
      reviewCount: Number(body.reviewCount) || 0,
      inStock: body.inStock ?? true,
      bestseller: body.bestseller ?? false,
      stripeProductId: body.stripeProductId ?? '',
    }

    products.push(newProduct)
    saveProducts(products)
    return NextResponse.json(newProduct, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'produit'
}
