import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string // 'admin' | 'student'
      collegeId: string
      college?: {
        name: string
      }
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    collegeId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    collegeId: string
  }
}