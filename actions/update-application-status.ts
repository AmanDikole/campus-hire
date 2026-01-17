'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidateTag } from "next/cache"

export async function updateApplicationStatus(applicationId: string, newStatus: string) {
  const session = await auth()
  
  // 1. Security Check: Only admins can update hiring statuses
  if (!session?.user || session.user.role !== 'admin') {
    return { error: "Unauthorized access." }
  }

  try {
    // 2. Atomic Update: Change status and create notification
    const application = await db.application.update({
      where: { id: applicationId },
      data: { status: newStatus },
      include: { 
        student: true,
        job: { select: { company: true } } 
      }
    })

    // 3. Create the Notification that triggers the Sidebar Badge
    await db.notification.create({
      data: {
        userId: application.studentId,
        message: `Status Updated: You have been ${newStatus} for ${application.job.company}.`,
        type: newStatus === 'Selected' ? 'success' : 'info',
        isRead: false
      }
    })

    // 4. Invalidate Cache for real-time dashboard updates
    // Note: If your TS still requires 2 arguments, use: revalidateTag('admin-analytics', 'default')
    revalidateTag('admin-analytics','default') 
    revalidateTag('placement-leaderboard','default')

    return { success: `Student marked as ${newStatus}` }
  } catch (error) {
    return { error: "Failed to update selection status." }
  }
}