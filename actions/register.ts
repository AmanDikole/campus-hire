'use server'

import { db } from "@/lib/db"
import { hash } from "bcryptjs"

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string 
  const prnNumber = formData.get('prnNumber') as string
  const collegeId = formData.get('collegeId') as string
  const fullName = formData.get('fullName') as string

  // 1. Basic Validation
  if (!email || !password || !prnNumber || !collegeId || !fullName) {
    return { error: "Please fill in all fields." }
  }

  try {
    // 2. PRN Check - Vital for industrial uniqueness
    const existingPrn = await db.profile.findUnique({ 
      where: { prnNumber } 
    })
    if (existingPrn) return { error: "This PRN is already registered." }

    // 3. Composite Email Check for Multi-tenant isolation
    const existingUser = await db.user.findUnique({
      where: {
        email_collegeId: { email, collegeId }
      }
    })
    if (existingUser) return { error: "Email already registered in this college." }

    // 4. Hash the password
    const hashedPassword = await hash(password, 12)

    // 5. Atomic Creation
    await db.user.create({
      data: {
        email,
        collegeId,
        password: hashedPassword,
        role: 'student', // Ensures correct portal access
        profile: {
          create: {
            fullName,
            prnNumber,
            isVerified: false // Triggers Admin verification queue
          }
        }
      }
    })

    return { success: "Account created! You can now log in." }
  } catch (error: any) {
    console.error("Registration Error:", error)
    if (error.code === 'P2002') {
      return { error: "Data conflict: PRN or Email is already in use." }
    }
    return { error: "Internal server error. Please try again later." }
  }
}