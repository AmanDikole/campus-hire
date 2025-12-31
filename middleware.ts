import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Initialize Response
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 2. Create Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // 3. Check if User is Logged In
  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // 🛑 RULE 1: If NOT logged in, block access to protected routes
  if (!user) {
    if (url.pathname.startsWith('/student') || url.pathname.startsWith('/admin')) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // 🛑 RULE 2: Role-Based Access Control
  if (user) {
    // Fetch Role from Metadata (We set this during Signup)
    const userRole = user.user_metadata?.role || 'student'

    // If a STUDENT tries to access ADMIN pages -> Kick to Student Dashboard
    if (url.pathname.startsWith('/admin') && userRole !== 'admin') {
      url.pathname = '/student'
      return NextResponse.redirect(url)
    }

    // If an ADMIN tries to access STUDENT pages -> Kick to Admin Dashboard
    // (Optional: Admins might want to see student views, but usually we separate them)
    if (url.pathname.startsWith('/student') && userRole === 'admin') {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
    
    // If logged in user tries to visit Login/Signup -> Redirect to their dashboard
    if (url.pathname === '/login' || url.pathname === '/signup') {
      url.pathname = userRole === 'admin' ? '/admin/dashboard' : '/student'
      return NextResponse.redirect(url)
    }
  }

  return response
}

// Config: Define which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (important for supabase auth flow)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}