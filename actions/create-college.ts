'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth" // ✅ Import Auth
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function createCollegeAction(formData: FormData) {
  const session = await auth()

  // 🔒 SECURITY CHECK
  if (!session?.user || session.user.email !== process.env.SUPER_ADMIN_EMAIL) {
    return { error: "⛔ Unauthorized: Super Admin Access Required" }
  }

  // ... rest of your code ...
  const name = formData.get('name') as string
  const subdomain = formData.get('subdomain') as string
  const location = formData.get('location') as string
  const adminEmail = formData.get('adminEmail') as string
  const adminPassword = formData.get('adminPassword') as string

  if (!name || !subdomain || !adminEmail || !adminPassword) {
    return { error: "All fields are required" }
  }

  try {
    // ... Create College Logic (Keep as is) ...
    const newCollege = await db.college.create({
      data: {
        name,
        subdomain: subdomain.toLowerCase(),
        location,
      }
    })

    // ... Create Admin Logic (Keep as is) ...
    const hashedPassword = await hash(adminPassword, 12)
    await db.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        collegeId: newCollege.id,
        profile: { create: { fullName: "Admin" } }
      }
    })

    revalidatePath('/super-admin')
    return { success: `Successfully created ${name}!` }

  } catch (error) {
    console.error("Create College Error:", error)
    return { error: "Failed to create college. Subdomain or Email might be taken." }
  }
}