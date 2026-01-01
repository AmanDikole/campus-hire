'use server'

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function updateStatus(applicationId: string, newStatus: string) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  // 1. Update the Application Status
  const { data: application, error } = await supabase
    .from('applications')
    .update({ status: newStatus })
    .eq('id', applicationId)
    .select('student_id, jobs(title, company)') // Fetch details for the message
    .single()

  if (error) return { success: false, error: error.message }

  // ✅ FIX: Safely access 'jobs'. TypeScript thinks it might be an array.
  // We check: Is it an array? If yes, take the first item. If no, use it directly.
  const jobData = Array.isArray(application.jobs) ? application.jobs[0] : application.jobs

  // 2. Create the Notification Message
  let message = `Your application for ${jobData.title} at ${jobData.company} has been updated to: ${newStatus}.`
  let type = 'info'

  if (newStatus === 'Shortlisted') {
    message = `🎉 Congratulations! You have been Shortlisted for ${jobData.title} at ${jobData.company}!`
    type = 'success'
  } else if (newStatus === 'Rejected') {
    message = `Update: Your application for ${jobData.title} was not selected.`
    type = 'error'
  }

  // 3. Insert Notification
  await supabase.from('notifications').insert([{
    student_id: application.student_id,
    message: message,
    type: type
  }])

  revalidatePath('/admin/students')
  return { success: true }
}