// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // 1. Block access if not logged in
  if (!user && (url.pathname.startsWith('/student') || url.pathname.startsWith('/admin'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Role-Based Redirection
  if (user) {
    const role = user.user_metadata?.role || 'student'
    if (url.pathname.startsWith('/admin') && role !== 'admin') {
      url.pathname = '/student'
      return NextResponse.redirect(url)
    }
    if (url.pathname.startsWith('/student') && role === 'admin') {
      url.pathname = '/admin/dashboard' // Optional: Admins usually stick to dashboard
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/callback).*)'],
}