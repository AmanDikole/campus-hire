'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateProfileAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const data = {
    fullName: formData.get('fullName') as string,
    branch: formData.get('branch') as string,
    gender: formData.get('gender') as string,
    cgpa: parseFloat(formData.get('cgpa') as string) || 0,
    percent10th: parseFloat(formData.get('percent10th') as string) || 0,
    percent12th: parseFloat(formData.get('percent12th') as string) || 0,
    passoutYear: parseInt(formData.get('passoutYear') as string) || 0,
    liveBacklogs: parseInt(formData.get('liveBacklogs') as string) || 0,
    deadBacklogs: parseInt(formData.get('deadBacklogs') as string) || 0,
    gapYears: parseInt(formData.get('gapYears') as string) || 0,
    resumeUrl: formData.get('resumeUrl') as string,
    githubUrl: formData.get('githubUrl') as string,
    // IMPORTANT: Reset verification status on update
    isVerified: false 
  }

  try {
    await db.profile.update({
      where: { userId: session.user.id },
      data: data
    })

    revalidatePath('/student/profile')
    return { success: "Profile updated! Waiting for Admin verification." }
  } catch (error) {
    return { error: "Failed to update profile." }
  }
}