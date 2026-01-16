'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateProfileAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const fullName = formData.get('fullName') as string
  const branch = formData.get('branch') as string
  const cgpa = parseFloat(formData.get('cgpa') as string)
  const percent10th = parseFloat(formData.get('percent10th') as string)
  const percent12th = parseFloat(formData.get('percent12th') as string)
  const resumeUrl = formData.get('resumeUrl') as string
  const linkedinUrl = formData.get('linkedinUrl') as string

  try {
    await db.profile.update({
      where: { userId: session.user.id },
      data: {
        fullName,
        branch,
        cgpa,
        percent10th,
        percent12th,
        resumeUrl,
        linkedinUrl
      }
    })

    revalidatePath('/student')
    revalidatePath('/student/profile')
    return { success: "Profile updated successfully!" }

  } catch (error) {
    console.error("Update Profile Error:", error)
    return { error: "Failed to update profile." }
  }
}