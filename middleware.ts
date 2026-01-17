import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role // Expected: 'admin' | 'student'
  
  const { pathname } = req.nextUrl
  const isOnAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isOnAdminArea = pathname.startsWith('/admin')
  const isOnStudentArea = pathname.startsWith('/student')
  const isRootPage = pathname === '/'

  // 1. Redirect Logged-In Users away from Login or Root to their respective dashboards
  if (isLoggedIn && (isOnAuthPage || isRootPage)) {
    const dashboard = userRole === 'admin' ? '/admin/dashboard' : '/student'
    return NextResponse.redirect(new URL(dashboard, req.nextUrl))
  }

  // 2. Protect Private Routes: Redirect unauthenticated users to Login
  if (!isLoggedIn && (isOnAdminArea || isOnStudentArea)) {
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.nextUrl))
  }

  // 3. Strict RBAC: Prevent students from accessing Admin areas and vice versa
  if (isLoggedIn) {
    if (isOnAdminArea && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/student', req.nextUrl))
    }
    if (isOnStudentArea && userRole !== 'student') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  // Matches all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}