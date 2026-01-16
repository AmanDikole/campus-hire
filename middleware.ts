import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role
  
  const isOnAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')
  const isOnAdminArea = req.nextUrl.pathname.startsWith('/admin')
  const isOnStudentArea = req.nextUrl.pathname.startsWith('/student')
  const isRootPage = req.nextUrl.pathname === '/'

  // 1. Redirect Logged-In Users away from Login (or Root)
  if (isLoggedIn && (isOnAuthPage || isRootPage)) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
    } else {
      return NextResponse.redirect(new URL('/student', req.nextUrl))
    }
  }

  // 2. Protect Private Routes (Redirect to Login)
  if (!isLoggedIn && (isOnAdminArea || isOnStudentArea)) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 3. Role-Based Access Control (RBAC)
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}