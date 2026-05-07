import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { getFormations, saveFormations, type Formation } from '@/lib/admin-data'

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const err = requireAdmin()
  if (err) return err
  const item = getFormations().find((f) => f.id === params.id)
  if (!item) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const err = requireAdmin()
  if (err) return err

  try {
    const body = await req.json() as Partial<Formation>
    const formations = getFormations()
    const idx = formations.findIndex((f) => f.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

    formations[idx] = {
      ...formations[idx],
      ...body,
      id: formations[idx].id,
      price: Number(body.price ?? formations[idx].price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : formations[idx].originalPrice,
      pages: body.pages ? Number(body.pages) : formations[idx].pages,
      rating: Number(body.rating ?? formations[idx].rating),
      reviewCount: Number(body.reviewCount ?? formations[idx].reviewCount),
    }
    saveFormations(formations)
    return NextResponse.json(formations[idx])
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const err = requireAdmin()
  if (err) return err

  const formations = getFormations()
  const idx = formations.findIndex((f) => f.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  formations.splice(idx, 1)
  saveFormations(formations)
  return NextResponse.json({ ok: true })
}
