import { db } from "@/lib/db"
import { auth } from "@/auth"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Calendar, Building2, MapPin, Loader2, AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function MyApplications() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // ✅ Fetch applications using Prisma
  const applications = await db.application.findMany({
    where: { 
      studentId: session.user.id 
    },
    include: {
      job: true // Fetch the related Job details
    },
    orderBy: { 
      appliedAt: 'desc' 
    }
  })

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">My Applications</h1>
          <p className="text-gray-500 mb-8">Track the live status of your hiring process.</p>

          <div className="space-y-4">
            {applications.length === 0 ? (
               <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-300 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No Applications Yet</h3>
                  <p className="text-gray-500 mt-1">Head over to the Job Feed to start applying!</p>
               </div>
            ) : (
              applications.map((app) => {
                const job = app.job
                
                // Handle case where job might be deleted
                if (!job) return (
                    <div key={app.id} className="p-4 bg-gray-100 rounded-xl text-gray-500 text-sm flex gap-2">
                        <AlertCircle size={16} /> Application for a deleted job.
                    </div>
                )

                return (
                  <div key={app.id} className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    
                    {/* Job Details */}
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-xl font-bold text-gray-900 border border-gray-100">
                        {job.company?.charAt(0) || "C"}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1.5">
                          <span className="font-medium text-gray-700">{job.company}</span>
                          <span className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Date */}
                    <div className="flex flex-row-reverse md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                      
                      {/* Status Badge */}
                      <StatusBadge status={app.status} />

                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Applied On</p>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                          <Calendar size={12} />
                          {/* ✅ Fix: use app.appliedAt */}
                          {new Date(app.appliedAt).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper Component for Status Colors
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm shadow-yellow-100',
    'Shortlisted': 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-100',
    'Selected': 'bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100',
    'Rejected': 'bg-red-50 text-red-700 border-red-200',
  }
  
  const currentStyle = styles[status] || styles['Pending']

  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${currentStyle} inline-flex items-center gap-2 transition-transform`}>
      {status === 'Pending' && <Loader2 size={12} className="animate-spin" />}
      {status}
    </span>
  )
}