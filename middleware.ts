import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret')

// Routes that don't require admin auth
const publicAdminRoutes = ['/admin/login', '/admin/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only check admin routes (except public ones)
  if (pathname.startsWith('/admin') && !publicAdminRoutes.includes(pathname)) {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const { payload } = await jwtVerify(token, secret)
      if (payload.role !== 'admin') {
        throw new Error('Not admin')
      }
    } catch {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

