import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      collegeId: string // ✅ Added
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    collegeId: string // ✅ Added
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    collegeId: string // ✅ Added
  }
}