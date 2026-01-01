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

  // 1. Update Status
  const { data: app, error } = await supabase
    .from('applications')
    .update({ status: newStatus })
    .eq('id', applicationId)
    .select('student_id, jobs(title, company)')
    .single()

  if (error) return { success: false, error: error.message }

  // 2. Handle Array/Object inconsistency
  const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs
  if (!job) return { success: true } // Safety check

  // 3. Create Notification
  let msg = `Your application for ${job.title} at ${job.company} is now: ${newStatus}.`
  if (newStatus === 'Shortlisted') msg = `🎉 Great news! You are Shortlisted for ${job.title}.`
  if (newStatus === 'Rejected') msg = `Update on your application for ${job.title}.`

  await supabase.from('notifications').insert([{
    student_id: app.student_id,
    message: msg,
    type: newStatus === 'Shortlisted' ? 'success' : 'info'
  }])

  revalidatePath('/admin/students')
  return { success: true }
}