import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ─── Admin ────────────────────────────────────────────────────────────────
  const isAdminPage =
    pathname === '/admin' ||
    (pathname.startsWith('/admin/') && !pathname.startsWith('/admin/login'))
  const isAdminApi =
    pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth/')

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get('admin_token')?.value
    if (!token) {
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
