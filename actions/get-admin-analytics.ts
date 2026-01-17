'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { unstable_cache } from "next/cache" // ✅ Use Cache wrapper

export const getAdminAnalytics = unstable_cache(
  async () => {
    const session = await auth()
    if (!session?.user) return null

    const collegeId = session.user.collegeId

    const [totalStudents, placedCount, branchStats, topJobs] = await Promise.all([
      db.user.count({ where: { collegeId, role: 'student' } }),
      db.user.count({ where: { collegeId, applications: { some: { status: "Selected" } } } }),
      db.profile.groupBy({
        by: ['branch'],
        where: { isVerified: true, user: { collegeId, applications: { some: { status: "Selected" } } } },
        _count: { _all: true }
      }),
      db.job.findMany({
        where: { collegeId },
        orderBy: { salary: 'desc' },
        take: 5
      })
    ])

    return {
      totalStudents,
      placedStudentsCount: placedCount,
      placementRate: totalStudents > 0 ? (placedCount / totalStudents) * 100 : 0,
      branchStats,
      topJobs
    }
  },
  ['admin-analytics'], // ✅ The Key
  { tags: ['admin-analytics'] } // ✅ The Tag
)