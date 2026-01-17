import { db } from "@/lib/db"
import { auth } from "@/auth"
import { AdminSidebar } from "@/components/AdminSidebar"
import { DashboardRow } from "@/components/DashboardRow"
import { Briefcase, Users, FileText, TrendingUp, Plus, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const session = await auth()
  
  // ✅ 1. Identity & College Context Check
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login')
  }

  const collegeId = session.user.collegeId

  if (!collegeId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900">Missing College Context</h2>
          <p className="text-gray-500 mt-2">Your account is not linked to a specific college. Please contact the system administrator.</p>
        </div>
      </div>
    )
  }

  // ✅ 2. Isolated Data Fetching
  const [jobs, recentApps, studentCounts] = await Promise.all([
    // Fetch only this college's jobs
    db.job.findMany({
      where: { collegeId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } }
    }),

    // Fetch only this college's recent applications
    db.application.findMany({
      where: { job: { collegeId } },
      take: 5,
      orderBy: { appliedAt: 'desc' },
      include: {
        student: { include: { profile: true } },
        job: true
      }
    }),

    // Get counts for placement rate calculation
    db.user.count({ where: { collegeId, role: 'student' } }),
  ])

  // ✅ 3. Dynamic Calculation
  const activeJobs = jobs.filter(j => j.isActive).length
  const totalApps = jobs.reduce((acc, job) => acc + job._count.applications, 0)
  
  // Calculate Placed Students (Students with at least one 'Selected' status)
  const placedCount = await db.user.count({
    where: {
      collegeId,
      applications: { some: { status: "Selected" } }
    }
  })

  const placementRate = studentCounts > 0 
    ? ((placedCount / studentCounts) * 100).toFixed(1) 
    : "0"

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">College Overview</h1>
              <p className="text-gray-500 mt-1 font-medium">Monitoring the 2025-2026 Recruitment Season.</p>
            </div>
            <Link href="/admin/post-job" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              <Plus size={20} /> Post New Drive
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="Active Drives" value={activeJobs} icon={Briefcase} color="blue" />
            <StatCard label="Total Applicants" value={totalApps} icon={FileText} color="purple" />
            <StatCard label="Placed Students" value={placedCount} icon={Users} color="orange" />
            <StatCard label="Placement Rate" value={`${placementRate}%`} icon={TrendingUp} color="green" />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-900">Recent Applications</h3>
              <Link href="/admin/students" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All Records</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Candidate</th>
                    <th className="px-8 py-5">Drive</th>
                    <th className="px-8 py-5">Applied On</th>
                    <th className="px-8 py-5">Current Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentApps.length > 0 ? (
                    recentApps.map((app) => (
                      <DashboardRow key={app.id} app={app} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-gray-400 font-bold">No recent applications found in this college.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-emerald-50 text-emerald-600",
  }
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div className={`p-4 rounded-2xl ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <h4 className="text-2xl font-black text-gray-900">{value}</h4>
      </div>
    </div>
  )
}