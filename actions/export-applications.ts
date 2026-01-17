'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function exportApplicationsAction(jobId: string) {
  const session = await auth()
  
  // Security Check: Only Admins can export data
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  const applications = await db.application.findMany({
    where: { jobId },
    include: {
      student: {
        include: {
          profile: true
        }
      },
      job: { select: { title: true, company: true } }
    }
  })

  if (applications.length === 0) return { error: "No applications found to export." }

  // Create CSV Header
  const headers = ["PRN Number", "Full Name", "Email", "Branch", "CGPA", "10th%", "12th%", "Backlogs", "Status", "Resume URL"]
  
  // Map data to rows
  const rows = applications.map(app => {
    const p = app.student.profile
    return [
      p?.prnNumber || "N/A",
      p?.fullName || "N/A",
      app.student.email,
      p?.branch || "N/A",
      p?.cgpa || 0,
      p?.percent10th || 0,
      p?.percent12th || 0,
      p?.liveBacklogs || 0,
      app.status,
      p?.resumeUrl || "No Resume"
    ].join(",")
  })

  const csvContent = [headers.join(","), ...rows].join("\n")
  const fileName = `${applications[0].job.company}_${applications[0].job.title}_Applicants.csv`

  return { csvContent, fileName }
}