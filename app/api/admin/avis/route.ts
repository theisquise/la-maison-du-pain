import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { getTestimonials, saveTestimonials, type Testimonial } from '@/lib/admin-data'

export async function GET() {
  const err = requireAdmin()
  if (err) return err
  return NextResponse.json(getTestimonials())
}

export async function POST(req: NextRequest) {
  const err = requireAdmin()
  if (err) return err

  try {
    const body = await req.json() as Partial<Testimonial>
    const data = getTestimonials()

    const newAvis: Testimonial = {
      id: Date.now().toString(),
      name: body.name ?? '',
      role: body.role ?? '',
      avatar: body.avatar ?? '',
      text: body.text ?? '',
      rating: Number(body.rating) || 5,
      product: body.product ?? '',
      date: body.date ?? new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    }

    data.testimonials.push(newAvis)
    saveTestimonials(data)
    return NextResponse.json(newAvis, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
