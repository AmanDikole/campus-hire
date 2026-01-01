import { AdminSidebar } from "@/components/AdminSidebar"
import { supabase } from "@/lib/supabase"
import { Users, Briefcase, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { DashboardRow } from "@/components/DashboardRow"
import { ReactNode } from "react"

interface Application {
  id: string;
  applied_at: string;
  jobs: { title: string; company: string };
  profiles: { full_name: string };
}

async function getAdminStats() {
  const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true })
  const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true })

  const { data: recentApps } = await supabase
    .from('applications')
    .select('*, jobs(title, company), profiles(full_name)') 
    .order('applied_at', { ascending: false })
    .limit(5)

  return { studentCount, jobCount, appCount, recentApps }
}

export default async function AdminDashboard() {
  const { studentCount, jobCount, appCount, recentApps } = await getAdminStats()

  return (
    // ✅ FIX: Added 'flex-col lg:flex-row' here
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      
      <AdminSidebar/>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
          </div>
          <Link 
            href="/admin/post-job" 
            className="group bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center gap-2"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
            Post New Drive
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Students" val={studentCount || 0} icon={Users} trend="+12%" color="blue" />
          <StatCard label="Active Jobs" val={jobCount || 0} icon={Briefcase} trend="Active" color="purple" />
          <StatCard label="Applications" val={appCount || 0} icon={TrendingUp} trend="Total" color="emerald" />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
               <h3 className="font-bold text-lg text-gray-900">Recent Applications</h3>
               <p className="text-gray-500 text-sm">Real-time application tracking</p>
            </div>
          </div>
          
          <div className="overflow-x-auto"> {/* ✅ FIX: Added scroll for small screens */}
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                <tr>
                    <th className="px-8 py-4 whitespace-nowrap">Candidate</th>
                    <th className="px-8 py-4 whitespace-nowrap">Applying For</th>
                    <th className="px-8 py-4 whitespace-nowrap">Applied Date</th>
                    <th className="px-8 py-4 whitespace-nowrap">Status</th>
                    <th className="px-8 py-4 text-right whitespace-nowrap">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {recentApps?.map((app: Application) => (
                    <DashboardRow key={app.id} app={app} />
                ))}
                </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-gray-50/50 text-center border-t border-gray-100">
            <Link 
              href="/admin/students" 
              className="text-sm text-gray-500 font-medium hover:text-black transition-colors inline-block w-full h-full"
            >
              View All Applications &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, val, icon: Icon, trend, color }: { label: string; val: number; icon: React.ComponentType<{ size?: number; className?: string }>; trend: string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600"
  }
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 ${colors[color].split(" ")[0]} opacity-20 rounded-full blur-2xl -mr-10 -mt-10`}></div>
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div><p className="text-sm text-gray-500 font-medium">{label}</p><h3 className="text-3xl font-bold text-gray-900 mt-1">{val}</h3></div>
        <div className={`p-3 rounded-xl ${colors[color]}`}><Icon size={22} /></div>
      </div>
      <div className="relative z-10 flex items-center gap-2"><TrendingUp size={14} className="text-emerald-500" /><span className="text-xs font-medium text-emerald-600">{trend}</span></div>
    </div>
  )
}