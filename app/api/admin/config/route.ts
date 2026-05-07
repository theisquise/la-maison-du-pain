import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { getConfig, saveConfig, type SiteConfigData } from '@/lib/admin-data'

export async function GET() {
  const err = requireAdmin()
  if (err) return err
  return NextResponse.json(getConfig())
}

export async function PUT(req: NextRequest) {
  const err = requireAdmin()
  if (err) return err

  try {
    const body = await req.json() as SiteConfigData
    saveConfig(body)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
}
