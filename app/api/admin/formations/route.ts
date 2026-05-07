import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { getFormations, saveFormations, type Formation } from '@/lib/admin-data'

export async function GET() {
  const err = requireAdmin()
  if (err) return err
  return NextResponse.json(getFormations())
}

export async function POST(req: NextRequest) {
  const err = requireAdmin()
  if (err) return err

  try {
    const body = await req.json() as Partial<Formation>
    const formations = getFormations()

    const newFormation: Formation = {
      id: slugify(body.name ?? '') + '-' + Date.now().toString(36),
      type: body.type ?? 'formation',
      name: body.name ?? '',
      shortDescription: body.shortDescription ?? '',
      longDescription: body.longDescription ?? '',
      price: Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      image: body.image ?? '',
      level: body.level ?? 'débutant',
      duration: body.duration,
      pages: body.pages ? Number(body.pages) : undefined,
      includes: Array.isArray(body.includes) ? body.includes : [],
      rating: Number(body.rating) || 5,
      reviewCount: Number(body.reviewCount) || 0,
      bestseller: body.bestseller ?? false,
      stripeProductId: body.stripeProductId ?? '',
      downloadUrl: body.downloadUrl ?? '',
    }

    formations.push(newFormation)
    saveFormations(formations)
    return NextResponse.json(newFormation, { status: 201 })
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
    .replace(/^-|-$/g, '') || 'formation'
}
