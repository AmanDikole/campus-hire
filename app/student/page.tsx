import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { JobCard } from "@/components/JobCard"
import { StudentSidebar } from "@/components/StudentSidebar"
import { JobSearch } from "@/components/JobSearch" 
import { Sparkles, Search } from "lucide-react"

// ✅ FIX 1: Update type to Promise
export default async function StudentDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  // ✅ FIX 2: Await the params before using them
  const params = await searchParams
  const query = params.q || ''

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single()

  // 1. Fetch Applied Job IDs
  const { data: applications } = await supabase
    .from('applications')
    .select('job_id')
    .eq('student_id', user?.id)
  
  const appliedJobIds = applications?.map(app => app.job_id) || []

  // 2. Fetch Jobs (Filtered by Query)
  let dbQuery = supabase.from('jobs').select('*').eq('is_active', true).order('created_at', { ascending: false })
  
  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,company.ilike.%${query}%`)
  }
  
  const { data: jobs } = await dbQuery

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <StudentSidebar />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-8 py-8 sticky top-0 z-30 bg-white/80 backdrop-blur-md">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  Find Your Next Role <Sparkles className="text-yellow-500" size={24} fill="currentColor" />
                </h1>
                <p className="text-gray-500 mt-1">
                  Welcome back, <span className="font-semibold text-gray-900">{profile?.full_name || "Student"}</span>. 
                  {jobs?.length || 0} jobs available.
                </p>
             </div>
             
             {/* Search Bar */}
             <JobSearch />
           </div>
        </div>

        {/* Jobs Grid */}
        <div className="p-8 max-w-7xl mx-auto">
            {jobs && jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    userProfile={profile}
                    hasApplied={appliedJobIds.includes(job.id)} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
                <p className="text-gray-500">Try searching for a different role or company.</p>
              </div>
            )}
        </div>
      </main>
    </div>
  )
}