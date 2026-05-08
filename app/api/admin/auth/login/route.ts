import { NextRequest, NextResponse } from 'next/server'
import { createToken, verifyPassword, COOKIE_NAME } from '@/lib/admin-auth'

const MAX_ATTEMPTS = 10
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

// In-memory per-IP rate limiter (resets on restart — fine for single-instance)
const attempts = new Map<string, { count: number; lockedUntil: number }>()

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const now = Date.now()
  const record = attempts.get(ip) ?? { count: 0, lockedUntil: 0 }

  if (record.lockedUntil > now) {
    const waitMin = Math.ceil((record.lockedUntil - now) / 60000)
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${waitMin} min.` },
      { status: 429 }
    )
  }

  try {
    const { password } = await req.json() as { password?: string }

    if (!password || !verifyPassword(password)) {
      record.count += 1
      record.lockedUntil = record.count >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0
      attempts.set(ip, record)
      // Fixed delay — slow down automated attacks
      await new Promise((r) => setTimeout(r, 800))
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    // Success — reset counter for this IP
    attempts.delete(ip)

    const token = createToken()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60,
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
