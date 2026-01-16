import { db } from "@/lib/db"
import { auth } from "@/auth"
import { StudentSidebar } from "@/components/StudentSidebar"
import { JobCard } from "@/components/JobCard"
import { redirect } from "next/navigation"

export default async function StudentDashboard() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  // 1. Fetch Student Profile (To check eligibility criteria like CGPA)
  const profile = await db.profile.findUnique({
    where: { userId: session.user.id }
  })

  // 2. Fetch Jobs (Only for this college)
  const jobs = await db.job.findMany({
    where: {
      isActive: true,
      collegeId: session.user.collegeId 
    },
    orderBy: { createdAt: 'desc' }
  })

  // 3. Fetch Applications (To check which jobs are already applied to)
  const applications = await db.application.findMany({
    where: { studentId: session.user.id },
    select: { jobId: true } // We only need the ID to check existence
  })

  // Create a Set for fast lookup (O(1) complexity)
  const appliedJobIds = new Set(applications.map(app => app.jobId))

  // 4. Get College Name (Optional, for display)
  const college = await db.college.findUnique({
    where: { id: session.user.collegeId }
  })

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <StudentSidebar />
      
      <main className="flex-1 p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
               {college?.name || "Campus"} Placements
            </h1>
            <p className="text-gray-500">Welcome back, {session.user.email}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                // ✅ Fix: Pass the missing props
                userProfile={profile} 
                hasApplied={appliedJobIds.has(job.id)}
              />
            ))}
            
            {jobs.length === 0 && (
               <p className="text-gray-500 col-span-2 text-center py-10">
                 No active drives at {college?.name} yet.
               </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}