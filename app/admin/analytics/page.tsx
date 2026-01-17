import { getAdminAnalytics } from "@/actions/get-admin-analytics"
import { AdminSidebar } from "@/components/AdminSidebar"
import { AnalyticsCharts } from "@/components/AnalyticsCharts" // ✅ Import the chart component
import { PieChart, Users, TrendingUp, Award, Building2 } from "lucide-react"

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalytics()

  if (!data) return <div className="p-10 text-center font-bold">Access Denied</div>

  // ✅ Format data for the Pie Chart (Placed vs Unplaced)
  const placementChartData = [
    { name: 'Placed', value: data.placedStudentsCount },
    { name: 'Unplaced', value: data.totalStudents - data.placedStudentsCount }
  ]

  // ✅ Format data for the Bar Chart (Branch Breakdown)
  const branchChartData = data.branchStats.map((stat: any) => ({
    branch: stat.branch || "Unknown",
    count: stat._count._all
  }))

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <PieChart className="text-blue-600" /> Season Analytics 2025-26
          </h1>

          {/* TOP LEVEL STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <Users className="text-blue-500 mb-2" size={24} />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Students</p>
              <h2 className="text-3xl font-black">{data.totalStudents}</h2>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <Award className="text-emerald-500 mb-2" size={24} />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Placed Students</p>
              <h2 className="text-3xl font-black text-emerald-600">{data.placedStudentsCount}</h2>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <TrendingUp className="text-purple-500 mb-2" size={24} />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Placement Rate</p>
              <h2 className="text-3xl font-black">{data.placementRate.toFixed(1)}%</h2>
            </div>
          </div>

          {/* ✅ INTERACTIVE CHARTS SECTION */}
          <div className="mb-10">
             <AnalyticsCharts 
                placementData={placementChartData} 
                branchData={branchChartData} 
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* BRANCH PERFORMANCE LIST */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-gray-400" /> Detailed Branch Progress
              </h3>
              <div className="space-y-6">
                {data.branchStats.map((stat: any) => (
                  <div key={stat.branch}>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-gray-700">{stat.branch}</span>
                      <span className="text-blue-600">{stat._count._all} Placed</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${data.placedStudentsCount > 0 ? (stat._count._all / data.placedStudentsCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP RECRUITERS LIST */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Top Salary Packages</h3>
              <div className="divide-y divide-gray-50">
                {data.topJobs.map((job: any, idx: number) => (
                  <div key={idx} className="py-4 flex justify-between items-center group hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.company}</p>
                      <p className="text-xs text-gray-400 font-medium">{job.title}</p>
                    </div>
                    <div className="text-emerald-600 font-black text-lg">
                      {job.salary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}