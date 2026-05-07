import { NextRequest, NextResponse } from 'next/server'
import { createToken, verifyPassword, COOKIE_NAME } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json() as { password?: string }

    if (!password || !verifyPassword(password)) {
      // Délai pour limiter les attaques par force brute
      await new Promise((r) => setTimeout(r, 500))
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    const token = createToken()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 heures
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
