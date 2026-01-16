import { db } from "@/lib/db"
import { auth } from "@/auth" // ✅ Import auth
import { AdminSidebar } from "@/components/AdminSidebar"
import { AnalyticsCharts } from "@/components/AnalyticsCharts"
import { TrendingUp, Users, CheckCircle } from "lucide-react"

async function getAnalyticsData() {
  const session = await auth()
  // Safety check: Return empty stats if not logged in
  if (!session?.user?.collegeId) return { branchStats: [], statusStats: [], total: 0 }

  // ✅ Secure: Fetch applications ONLY for this college
  const applications = await db.application.findMany({
    where: {
      collegeId: session.user.collegeId // <--- The Critical Filter
    },
    include: {
      student: {
        include: {
          profile: {
            select: { branch: true }
          }
        }
      }
    }
  })

  // 1. Calculate Branch Stats
  const branchCounts: Record<string, number> = {}
  
  applications.forEach((app) => {
    // Prisma nested access: app -> student -> profile -> branch
    const branch = app.student?.profile?.branch || 'Unknown'
    branchCounts[branch] = (branchCounts[branch] || 0) + 1
  })

  const branchStats = Object.keys(branchCounts).map(branch => ({
    name: branch,
    applications: branchCounts[branch]
  }))

  // 2. Calculate Status Stats
  const statusCounts: Record<string, number> = {
    'Pending': 0, 'Shortlisted': 0, 'Rejected': 0, 'Selected': 0
  }
  
  applications.forEach((app) => {
    const status = app.status || 'Pending'
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++
    } else {
      statusCounts[status] = 1 
    }
  })

  const statusStats = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }))

  return { branchStats, statusStats, total: applications.length }
}

export default async function AnalyticsPage() {
  const { branchStats, statusStats, total } = await getAnalyticsData()

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Placement Analytics</h1>
            <p className="text-gray-500 mt-2">Real-time insights into student performance and hiring trends.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Applications */}
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 font-medium">Total Applications</p>
                  <h3 className="text-4xl font-bold mt-2">{total}</h3>
                </div>
                <div className="bg-white/20 p-2 rounded-lg"><TrendingUp size={24} /></div>
              </div>
            </div>

            {/* Shortlisted Count */}
            <div className="bg-white text-gray-900 p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 font-medium">Shortlisted</p>
                  <h3 className="text-4xl font-bold mt-2">
                    {statusStats.find(s => s.name === 'Shortlisted')?.value || 0}
                  </h3>
                </div>
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><CheckCircle size={24} /></div>
              </div>
            </div>

            {/* Branch Participation */}
            <div className="bg-white text-gray-900 p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 font-medium">Participation</p>
                  <h3 className="text-4xl font-bold mt-2">
                    {branchStats.length} <span className="text-lg text-gray-400 font-normal">Branches</span>
                  </h3>
                </div>
                <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><Users size={24} /></div>
              </div>
            </div>
          </div>

          {/* Render the Charts */}
          <AnalyticsCharts branchData={branchStats} statusData={statusStats} />

        </div>
      </main>
    </div>
  )
}