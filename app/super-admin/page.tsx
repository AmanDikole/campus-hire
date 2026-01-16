import { db } from "@/lib/db"
import { CreateCollegeForm } from "@/components/CreateCollegeForm"
import { ShieldCheck, Users, Server, ExternalLink, Activity, Plus } from "lucide-react"
import { auth } from "@/auth" // 👈 Add this import
import { redirect } from "next/navigation" //

export default async function SuperAdminPage() {

    const session = await auth() // 👈 Get session
    if (!session?.user || session.user.email !== process.env.SUPER_ADMIN_EMAIL) {
    return redirect("/") 
  }

  const colleges = await db.college.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { createdAt: 'desc' }
  })

  // Calculate stats
  const totalColleges = colleges.length
  const totalUsers = colleges.reduce((acc, curr) => acc + curr._count.users, 0)

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold">
                    S
                </div>
                <span className="font-bold text-lg tracking-tight">SuperAdmin</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    System Operational
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <h3 className="text-3xl font-bold mt-2 text-gray-900">{totalUsers}</h3>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Users size={20} /></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Tenants</p>
                        <h3 className="text-3xl font-bold mt-2 text-gray-900">{totalColleges}</h3>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Server size={20} /></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Server Status</p>
                        <h3 className="text-3xl font-bold mt-2 text-emerald-600">Healthy</h3>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Activity size={20} /></div>
                </div>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: Create Form (4 Columns) */}
          <div className="lg:col-span-4">
             <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                    <Plus size={18} className="text-gray-400" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Onboard New Client</h2>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <CreateCollegeForm />
                </div>
             </div>
          </div>

          {/* RIGHT: List (8 Columns) */}
          <div className="lg:col-span-8">
             <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <Server size={18} className="text-gray-400" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Active Deployments</h2>
                 </div>
                 <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">{colleges.length} Found</span>
             </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
               {colleges.length === 0 ? (
                   <div className="p-10 text-center text-gray-400 text-sm">No colleges deployed yet.</div>
               ) : (
                  <div className="divide-y divide-gray-100">
                    {colleges.map(college => (
                        <div key={college.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500 border border-gray-200">
                                    {college.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{college.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                        <span>{college.subdomain}.campushire.com</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{college.location || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">{college._count.users}</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Users</p>
                                </div>
                                <a 
                                    href="#" 
                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Open Dashboard"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>
                    ))}
                  </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}