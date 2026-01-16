'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function applyForJob(jobId: string) {
  const session = await auth()
  
  // 1. Security Check
  if (!session?.user || session.user.role !== 'student') {
    return { error: "Unauthorized" }
  }

  try {
    // 2. Check for duplicate application
    const existing = await db.application.findUnique({
      where: {
        jobId_studentId: {
          jobId,
          studentId: session.user.id
        }
      }
    })

    if (existing) {
      return { error: "You have already applied for this job." }
    }

    // 3. Create Application (Tagged with CollegeId)
    await db.application.create({
      data: {
        jobId,
        studentId: session.user.id,
        collegeId: session.user.collegeId, // ✅ CRITICAL: Links app to the college
        status: "Pending"
      }
    })

    // 4. Update UI
    revalidatePath('/student')
    revalidatePath('/student/applications')
    return { success: "Application submitted successfully!" }

  } catch (error) {
    console.error("Apply Error:", error)
    return { error: "Something went wrong. Please try again." }
  }
}