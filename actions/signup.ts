'use server'

import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const branch = formData.get('branch') as string

  if (!email || !password || !fullName) {
    return { error: "All fields are required" }
  }

  // 1. Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: "User already exists with this email." }
  }

  try {
    // 2. Hash the password (Never store plain text passwords!)
    const hashedPassword = await hash(password, 10)

    // 3. Create User & Profile in a Transaction
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'student', // Default role is always student
        }
      })

      await tx.profile.create({
        data: {
          userId: user.id,
          fullName,
          branch: branch || 'CSE', // Default branch
        }
      })
    })

  } catch (error) {
    console.error("Signup Error:", error)
    return { error: "Something went wrong. Please try again." }
  }

  // 4. Redirect to login on success
  redirect('/login?success=Account created! Please log in.')
}