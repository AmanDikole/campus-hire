'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function getStudentStats() {
  const session = await auth()
  if (!session?.user) return null

  const [activeDrives, pendingApps, shortlisted] = await Promise.all([
    // 1. Total active jobs in their college
    db.job.count({ where: { collegeId: session.user.collegeId, isActive: true } }),
    
    // 2. Applications waiting for a result
    db.application.count({ 
      where: { studentId: session.user.id, status: "Pending" } 
    }),

    // 3. Positive progress
    db.application.count({ 
      where: { studentId: session.user.id, status: "Shortlisted" } 
    })
  ])

  return { activeDrives, pendingApps, shortlisted }
}