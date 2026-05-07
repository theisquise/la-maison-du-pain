import { NextRequest, NextResponse } from 'next/server'

// Edge-compatible HMAC-SHA256 token verification (no Node.js crypto)
async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SECRET ?? 'admin-secret-change-me-in-production'
    const parts = token.split('.')
    if (parts.length !== 2) return false
    const [b64, sig] = parts

    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['verify']
    )

    // base64url → ArrayBuffer
    const b64std = sig.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64std + '=='.slice(0, (4 - (b64std.length % 4)) % 4)
    const sigBytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))

    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(b64))
    if (!valid) return false

    // Check expiry
    const payloadStr = atob(
      b64.replace(/-/g, '+').replace(/_/g, '/') +
        '=='.slice(0, (4 - (b64.length % 4)) % 4)
    )
    const payload = JSON.parse(payloadStr)
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ─── Admin ────────────────────────────────────────────────────────────────
  const isAdminPage =
    pathname === '/admin' ||
    (pathname.startsWith('/admin/') && !pathname.startsWith('/admin/login'))
  const isAdminApi =
    pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth/')

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get('admin_token')?.value
    const valid = token ? await verifyAdminToken(token) : false
    if (!valid) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ─── Espace client ────────────────────────────────────────────────────────
  const isCustomerPage =
    pathname === '/mon-compte' ||
    (pathname.startsWith('/mon-compte/') && !pathname.startsWith('/mon-compte/connexion'))

  if (isCustomerPage) {
    const token = req.cookies.get('customer_token')?.value
    if (!token) {
      const loginUrl = new URL('/mon-compte/connexion', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*', '/mon-compte', '/mon-compte/:path*'],
}
