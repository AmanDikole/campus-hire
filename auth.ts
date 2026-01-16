import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { authConfig } from "@/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials.email as string
        const password = credentials.password as string

        if (!email || !password) return null

        // 1. Find User (and their college)
        const user = await db.user.findFirst({ 
          where: { email },
          include: { college: true } 
        })

        if (!user) return null

        const passwordsMatch = await compare(password, user.password)
        if (!passwordsMatch) return null

        // 2. Return User + College ID
        return { 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          collegeId: user.collegeId // ✅ We pass this to the token
        }
      },
    }),
  ],
})