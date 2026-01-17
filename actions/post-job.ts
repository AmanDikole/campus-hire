'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function postJobAction(formData: FormData) {
  const session = await auth()
  
  // 1. Security & Role Check
  if (!session?.user || session.user.role !== 'admin' || !session.user.collegeId) {
    return { error: "Unauthorized: Admin access required." }
  }

  // 2. Extract Basic Info
  const title = formData.get('title') as string
  const company = formData.get('company') as string
  const location = formData.get('location') as string
  const salary = formData.get('salary') as string
  const description = formData.get('description') as string
  
  // 3. Extract Academic Thresholds
  const minCgpa = parseFloat(formData.get('min_cgpa') as string) || 0
  const min10thPercent = parseFloat(formData.get('min_10th') as string) || 0
  const min12thPercent = parseFloat(formData.get('min_12th') as string) || 0
  
  // 4. Industrial Filters (Added these to match your Schema)
  const maxLiveBacklogs = parseInt(formData.get('max_live_backlogs') as string) || 0
  const requireVerification = formData.get('require_verification') === 'on' // Checkbox
  
  const eligibleBranches = JSON.parse(formData.get('eligible_branches') as string || '[]')
  const eligibleGender = formData.get('eligible_gender') as string || "Any"

  // 5. Validation
  if (!title || !company || !location || !description) {
    return { error: "Please fill in all core job details." }
  }

  try {
    // 6. Database Creation
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
        // Using the fields we added to handle industrial drives
        eligibleGender,
        eligibleBranches,
        isActive: true,
        collegeId: session.user.collegeId 
      }
    })

    // 7. Refresh Relevant Views
    revalidatePath('/admin/dashboard')
    revalidatePath('/student/jobs') 
    
    return { success: `Placement Drive for ${company} is now Live!` }

  } catch (error) {
    console.error("Post Job Error:", error)
    return { error: "Failed to create drive. Database error." }
  }
}