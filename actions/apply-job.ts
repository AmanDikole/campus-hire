'use server'

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function applyForJob(jobId: string, studentId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  // 1. Fetch Job Criteria
  const { data: job } = await supabase.from('jobs').select('*').eq('id', jobId).single()
  
  // 2. Fetch Student Profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', studentId).single()

  if (!profile) {
    return { success: false, message: "Please complete your profile first." }
  }

  // --- 🛡️ THE GATEKEEPER CHECKS ---

  // Check 1: Branch Eligibility
  // If job has specific branches, check if student belongs to one
  if (job.eligible_branches && job.eligible_branches.length > 0) {
    if (!job.eligible_branches.includes(profile.branch)) {
      return { success: false, message: `Eligibility Failed: Only ${job.eligible_branches.join(", ")} students can apply.` }
    }
  }

  // Check 2: Gender Eligibility
  if (job.eligible_gender !== 'Any' && job.eligible_gender !== profile.gender) {
    return { success: false, message: `Eligibility Failed: This drive is for ${job.eligible_gender} candidates only.` }
  }

  // Check 3: Academic Scores
  if ((profile.cgpa || 0) < job.min_cgpa) {
    return { success: false, message: `Eligibility Failed: Min CGPA required is ${job.min_cgpa}. Your CGPA: ${profile.cgpa}` }
  }

  if ((profile.percent_10th || 0) < job.min_10th_percent) {
    return { success: false, message: `Eligibility Failed: Min 10th % required is ${job.min_10th_percent}%.` }
  }

  if ((profile.percent_12th || 0) < job.min_12th_percent) {
    return { success: false, message: `Eligibility Failed: Min 12th % required is ${job.min_12th_percent}%.` }
  }

  // Check 4: Already Applied?
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .match({ job_id: jobId, student_id: studentId })
    .single()

  if (existing) {
    return { success: false, message: "You have already applied for this job." }
  }

  // --- ✅ ALL CHECKS PASSED: INSERT APPLICATION ---
  
  const { error } = await supabase.from('applications').insert([{
    job_id: jobId,
    student_id: studentId,
    student_email: profile.email || 'unknown', // Fallback
    status: 'Pending'
  }])

  if (error) return { success: false, message: error.message }

  // Create a success notification
  await supabase.from('notifications').insert([{
    student_id: studentId,
    message: `Application Successful for ${job.title} at ${job.company}!`,
    type: 'success'
  }])

  revalidatePath('/student')
  return { success: true, message: "Application Submitted Successfully!" }
}