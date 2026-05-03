import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USER = 'gabriel.godoy.dv@gmail.com'
const ADMIN_PASS = 'GGF@divermente2023'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo rutas que empiecen exactamente con /admin
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')

  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const base64 = authHeader.split(' ')[1]
      const decoded = atob(base64)
      const colonIndex = decoded.indexOf(':')
      const user = decoded.slice(0, colonIndex)
      const pass = decoded.slice(colonIndex + 1)
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        return NextResponse.next()
      }
    } catch {
      // credenciales inválidas
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