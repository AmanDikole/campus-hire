'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateStatus(applicationId: string, newStatus: string) {
  try {
    // We use a transaction to ensure both the Update and the Notification happen together
    await db.$transaction(async (tx) => {
      
      // 1. Update Application & Fetch Job Details
      const application = await tx.application.update({
        where: { id: applicationId },
        data: { status: newStatus },
        include: { 
          job: true // Fetch job to get Title & Company
        }
      })

      // 2. Create Notification Message
      const jobTitle = application.job.title
      const company = application.job.company
      
      let msg = `Your application for ${jobTitle} at ${company} is now: ${newStatus}.`
      let type = 'info'

      if (newStatus === 'Shortlisted') {
        msg = `🎉 Great news! You are Shortlisted for ${jobTitle} at ${company}.`
        type = 'success'
      } else if (newStatus === 'Rejected') {
        msg = `Update on your application for ${jobTitle}.`
        type = 'error'
      } else if (newStatus === 'Selected') {
        msg = `Congratulations! You have been Selected for ${jobTitle}!`
        type = 'success'
      }

      // 3. Create Notification
      await tx.notification.create({
        data: {
          userId: application.studentId, // Send to the student
          message: msg,
          type: type
        }
      })
    })

    revalidatePath('/admin/students')
    return { success: true }

  } catch (error) {
    console.error("Update Status Error:", error)
    return { success: false, error: "Failed to update status." }
  }
}