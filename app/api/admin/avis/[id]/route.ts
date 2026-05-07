import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { getTestimonials, saveTestimonials, type Testimonial } from '@/lib/admin-data'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const err = requireAdmin()
  if (err) return err

  try {
    const body = await req.json() as Partial<Testimonial>
    const data = getTestimonials()
    const idx = data.testimonials.findIndex((t) => t.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

    data.testimonials[idx] = {
      ...data.testimonials[idx],
      ...body,
      id: data.testimonials[idx].id,
      rating: Number(body.rating ?? data.testimonials[idx].rating),
    }
    saveTestimonials(data)
    return NextResponse.json(data.testimonials[idx])
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const err = requireAdmin()
  if (err) return err

  const data = getTestimonials()
  const idx = data.testimonials.findIndex((t) => t.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  data.testimonials.splice(idx, 1)
  saveTestimonials(data)
  return NextResponse.json({ ok: true })
}
