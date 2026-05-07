import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/admin-auth'

export function requireAdmin(): NextResponse | null {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  return null
}
