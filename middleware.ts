import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

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

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
}
