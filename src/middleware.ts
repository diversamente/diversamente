import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USER = 'gabriel.godoy.dv@gmail.com'
const ADMIN_PASS = 'GGF@divermente2023'

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    const base64 = authHeader.split(' ')[1]
    const decoded = atob(base64)
    const [user, pass] = decoded.split(':')
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Acceso restringido', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Panel DiversaMente"',
    },
  })
}

export const config = {
  matcher: '/admin/:path*',
}