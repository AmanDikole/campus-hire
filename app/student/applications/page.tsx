import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Calendar, Building2, MapPin, Loader2 } from "lucide-react"

async function getMyApplications() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Fetch applications AND the related Job details
  const { data } = await supabase
    .from('applications')
    .select('*, jobs(*)') 
    .eq('student_email', user.email)
    .order('applied_at', { ascending: false })

  return data || []
}

export default async function MyApplications() {
  const applications = await getMyApplications()

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <StudentSidebar />

      <main className="flex-1 p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">My Applications</h1>
          <p className="text-gray-500 mb-8">Track the status of your job applications.</p>

          <div className="space-y-4">
            {applications.length === 0 ? (
               <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500">You haven't applied to any jobs yet.</p>
               </div>
            ) : (
              applications.map((app: any) => (
                <div key={app.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  {/* Job Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{app.jobs?.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="font-medium">{app.jobs?.company}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {app.jobs?.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Date */}
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Applied On</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-0.5">
                        <Calendar size={14} />
                        {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <StatusBadge status={app.status || 'Pending'} />
                  </div>
                </div>
              ))
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
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Shortlisted': 'bg-blue-50 text-blue-700 border-blue-200',
    'Selected': 'bg-green-50 text-green-700 border-green-200',
    'Rejected': 'bg-red-50 text-red-700 border-red-200',
  }
  
  const currentStyle = styles[status] || styles['Pending']

  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${currentStyle} inline-flex items-center gap-1.5`}>
      {status === 'Pending' && <Loader2 size={12} className="animate-spin" />}
      {status}
    </span>
  )
}