'use server'

import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const collegeId = formData.get('collegeId') as string
  const role = 'student' // Signups are always students by default

  if (!email || !password || !collegeId) {
    return { error: "All fields are required" }
  }

  try {
    // 1. Check if user exists IN THIS COLLEGE
    const existingUser = await db.user.findFirst({
      where: {
        email,
        collegeId // ✅ Scoped check
      }
    })

    if (existingUser) {
      return { error: "User already exists in this college." }
    }

    // 2. Hash Password
    const hashedPassword = await hash(password, 12)

    // 3. Create User & Profile
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        collegeId,
        role,
        profile: {
          create: {
            fullName: email.split('@')[0], // Default name from email
          }
        }
      }
    })

    return { success: true }

  } catch (error) {
    console.error("Register Error:", error)
    return { error: "Registration failed." }
  }
}