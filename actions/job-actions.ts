'use server'

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// 1. Toggle Active/Closed Status
export async function toggleJobStatus(jobId: string, currentStatus: boolean) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  const { error } = await supabase
    .from('jobs')
    .update({ is_active: !currentStatus })
    .eq('id', jobId)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/jobs')
  revalidatePath('/student') // Update student view too
  return { success: true }
}

// 2. Delete Job
export async function deleteJob(jobId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  const { error } = await supabase.from('jobs').delete().eq('id', jobId)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/jobs')
  revalidatePath('/student')
  return { success: true }
}