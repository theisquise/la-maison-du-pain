import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { getProducts, saveProducts, type Product } from '@/lib/admin-data'

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const err = requireAdmin()
  if (err) return err
  const product = getProducts().find((p) => p.id === params.id)
  if (!product) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const err = requireAdmin()
  if (err) return err

  try {
    const body = await req.json() as Partial<Product>
    const products = getProducts()
    const idx = products.findIndex((p) => p.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

    products[idx] = {
      ...products[idx],
      ...body,
      id: products[idx].id, // l'ID ne change pas
      price: Number(body.price ?? products[idx].price),
      rating: Number(body.rating ?? products[idx].rating),
      reviewCount: Number(body.reviewCount ?? products[idx].reviewCount),
    }
    saveProducts(products)
    return NextResponse.json(products[idx])
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const err = requireAdmin()
  if (err) return err

  const products = getProducts()
  const idx = products.findIndex((p) => p.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  products.splice(idx, 1)
  saveProducts(products)
  return NextResponse.json({ ok: true })
}
