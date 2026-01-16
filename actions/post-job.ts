'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth" // ✅ Import auth
import { revalidatePath } from "next/cache"

export async function postJobAction(formData: FormData) {
  const session = await auth()
  
  // 1. Security Check: Must be logged in & have a college
  if (!session?.user || !session.user.collegeId) {
    return { error: "Unauthorized" }
  }

  const title = formData.get('title') as string
  const company = formData.get('company') as string
  const location = formData.get('location') as string
  const salary = formData.get('salary') as string
  const description = formData.get('description') as string
  
  const minCgpa = parseFloat(formData.get('min_cgpa') as string) || 0
  const min10thPercent = parseFloat(formData.get('min_10th') as string) || 0
  const min12thPercent = parseFloat(formData.get('min_12th') as string) || 0
  
  const eligibleBranches = JSON.parse(formData.get('eligible_branches') as string || '[]')
  const eligibleGender = formData.get('eligible_gender') as string

  if (!title || !company || !location) {
    return { error: "Please fill in all required fields." }
  }

  try {
    await db.job.create({
      data: {
        title,
        company,
        location,
        salary,
        description,
        minCgpa,
        min10thPercent,
        min12thPercent,
        eligibleGender,
        eligibleBranches,
        isActive: true,
        // ✅ CRITICAL: Attach the job to the Admin's College
        collegeId: session.user.collegeId 
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath('/student') 
    return { success: "Job Drive Posted Successfully!" }

  } catch (error) {
    console.error("Post Job Error:", error)
    return { error: "Failed to create job. Please try again." }
  }
}