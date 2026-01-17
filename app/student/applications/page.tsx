import { db } from "@/lib/db"
import { auth } from "@/auth"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Calendar, Building2, MapPin, Loader2, AlertCircle, PartyPopper, CheckCircle, XCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function MyApplications() {
  const session = await auth()
  
  if (!session?.user) redirect('/login')

  const applications = await db.application.findMany({
    where: { studentId: session.user.id },
    include: {
      job: {
        select: {
          title: true,
          company: true,
          location: true,
          createdAt: true,
        }
      }
    },
    orderBy: { appliedAt: 'desc' }
  })

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Applications</h1>
            <p className="text-gray-500 mt-1">Real-time tracking of your professional journey.</p>
          </header>

          <div className="grid gap-4">
            {applications.length === 0 ? (
               <div className="bg-white p-20 rounded-[2rem] border-2 border-dashed border-gray-200 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Building2 className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No active applications</h3>
                  <p className="text-gray-500 mt-2 max-w-xs mx-auto">Your next big opportunity is waiting in the job feed.</p>
               </div>
            ) : (
              applications.map((app) => {
                const job = app.job
                if (!job) return null

                return (
                  <div key={app.id} className={`group bg-white p-6 rounded-3xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${app.status === 'Selected' ? 'border-emerald-200 bg-emerald-50/20 shadow-lg shadow-emerald-100/50' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}>
                    
                    <div className="flex items-start gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black border transition-colors ${app.status === 'Selected' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-gray-50 text-gray-900 border-gray-100'}`}>
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1.5 font-medium">
                          <span className="text-gray-900">{job.company}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="flex items-center gap-1"><MapPin size={14} className="opacity-70" /> {job.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row-reverse md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                      <StatusBadge status={app.status} />
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Application Date</p>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                          <Calendar size={12} className="opacity-50" />
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

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { class: string, icon: any }> = {
    'Pending': { 
        class: 'bg-amber-50 text-amber-700 border-amber-200', 
        icon: <Loader2 size={14} className="animate-spin" /> 
    },
    'Shortlisted': { 
        class: 'bg-blue-50 text-blue-700 border-blue-200', 
        icon: <CheckCircle size={14} /> 
    },
    'Selected': { 
        class: 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-200 animate-pulse', 
        icon: <PartyPopper size={14} /> 
    },
    'Rejected': { 
        class: 'bg-gray-100 text-gray-500 border-gray-200', 
        icon: <XCircle size={14} /> 
    },
  }
  
  const current = config[status] || config['Pending']

  return (
    <span className={`px-4 py-2 rounded-xl text-xs font-black border uppercase tracking-wider inline-flex items-center gap-2 ${current.class}`}>
      {current.icon}
      {status}
    </span>
  )
} 