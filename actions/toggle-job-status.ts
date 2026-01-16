'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function toggleJobStatus(jobId: string, currentStatus: boolean) {
  try {
    // ✅ Prisma Update
    await db.job.update({
      where: { id: jobId },
      data: { 
        isActive: !currentStatus 
      }
    })

    revalidatePath('/admin/jobs')
    revalidatePath('/student') // Refresh student feed so closed jobs disappear
    return { success: true }
    
  } catch (error) {
    console.error("Toggle Job Status Error:", error)
    return { success: false, error: "Failed to update status" }
  }
}