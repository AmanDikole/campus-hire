import { db } from "@/lib/db"
import { AdminSidebar } from "@/components/AdminSidebar"
import { DashboardRow } from "@/components/DashboardRow"
import { Briefcase, Users, FileText, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  // 1. Fetch Jobs with Application Counts
  const jobs = await db.job.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { applications: true } }
    }
  })

  // 2. Fetch Recent Applications
  const recentApps = await db.application.findMany({
    take: 5,
    orderBy: { appliedAt: 'desc' },
    include: {
      student: {
        include: { profile: true } // Fetch Profile to get Name
      },
      job: true // Fetch Job to get Title
    }
  })

  // 3. Calculate Stats
  const activeJobs = jobs.filter(j => j.isActive).length
  const totalApps = jobs.reduce((acc, job) => acc + job._count.applications, 0)
  const avgApps = jobs.length > 0 ? Math.round(totalApps / jobs.length) : 0

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
              <p className="text-gray-500 mt-1">Welcome back, Admin.</p>
            </div>
            <Link href="/admin/post-job" className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition shadow-lg shadow-gray-200">
              <Plus size={20} /> Post New Drive
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="Active Drives" value={activeJobs} icon={Briefcase} color="blue" />
            <StatCard label="Total Applications" value={totalApps} icon={FileText} color="purple" />
            <StatCard label="Avg. Response" value={avgApps} icon={Users} color="orange" />
            <StatCard label="Placement Rate" value="Pending" icon={TrendingUp} color="green" />
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-900">Recent Applications</h3>
              <Link href="/admin/students" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold">
                  <tr>
                    <th className="px-8 py-4">Candidate</th>
                    <th className="px-8 py-4">Role Applied</th>
                    <th className="px-8 py-4">Applied On</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentApps.length > 0 ? (
                    recentApps.map((app) => (
                      <DashboardRow key={app.id} app={app} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-500">No applications yet.</td>
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
    green: "bg-green-50 text-green-600",
  }
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-xl ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      </div>
    </div>
  )
}