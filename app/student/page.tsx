import { db } from "@/lib/db"
import { auth } from "@/auth"
import { StudentSidebar } from "@/components/StudentSidebar"
import { JobCard } from "@/components/JobCard"
import { StatsGallery } from "@/components/StatsGallery" // ✅ Import our new component
import { redirect } from "next/navigation"
import { Sparkles } from "lucide-react"

export default async function StudentDashboard() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  // 1. Fetch Student Profile
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

  // 3. Fetch Applications for fast lookup
  const applications = await db.application.findMany({
    where: { studentId: session.user.id },
    select: { jobId: true }
  })
  const appliedJobIds = new Set(applications.map(app => app.jobId))

  // 4. Get College Name
  const college = await db.college.findUnique({
    where: { id: session.user.collegeId }
  })

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50">
      <StudentSidebar />
      
      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER SECTION */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
                <Sparkles size={14} />
                Student Dashboard
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                {college?.name || "Campus"} Drives
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Explore active placement opportunities and track your progress.
              </p>
            </div>
            
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-gray-400 uppercase">Current Session</p>
              <p className="text-sm font-bold text-gray-900">2025-2026 Batch</p>
            </div>
          </header>
          
          {/* ✅ THE STATS GALLERY (Summary Cards) */}
          <StatsGallery />

          {/* JOBS FEED SECTION */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Opportunities</h2>
            <span className="bg-gray-200 text-gray-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
              {jobs.length} Drives Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                userProfile={profile} 
                hasApplied={appliedJobIds.has(job.id)}
              />
            ))}
            
            {jobs.length === 0 && (
               <div className="col-span-full bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
                  <p className="text-gray-400 font-bold">
                    No active recruitment drives at the moment.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Check back later or complete your profile.</p>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}