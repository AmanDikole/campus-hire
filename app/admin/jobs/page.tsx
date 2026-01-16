import { db } from "@/lib/db"
import { auth } from "@/auth" // ✅ Import auth
import { AdminSidebar } from "@/components/AdminSidebar"
import { JobControlCard } from "@/components/JobControlCard"
import { Plus, Briefcase } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ManageJobs() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // ✅ Security Fix: Filter by collegeId
  const jobs = await db.job.findMany({
    where: {
      collegeId: session.user.collegeId
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { applications: true }
      }
    }
  })

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Drives</h1>
              <p className="text-gray-500 mt-2">Control active job listings and monitor responses.</p>
            </div>
            
            <Link href="/admin/post-job" className="bg-black text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-zinc-800 transition shadow-lg shadow-gray-200">
              <Plus size={18} /> Post New Drive
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobControlCard 
                key={job.id} 
                job={job} 
                applicantCount={job._count.applications} 
              />
            ))}
            
            {jobs.length === 0 && (
              <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <Briefcase className="mx-auto text-gray-300 mb-3" size={32} />
                <p className="text-gray-500">No jobs posted yet.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}