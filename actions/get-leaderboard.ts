'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function getLeaderboardData() {
  const session = await auth()
  if (!session?.user) return null

  const successStories = await db.application.findMany({
    where: {
      status: "Selected",
      // Tenant Isolation: Only show for this college
      job: { collegeId: session.user.collegeId }
    },
    include: {
      student: {
        include: { profile: true }
      },
      job: {
        select: {
          company: true,
          title: true,
          salary: true,
        }
      }
    },
    orderBy: {
      appliedAt: 'desc'
    }
  })

  return successStories
}