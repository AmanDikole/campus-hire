import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { JobCard } from "@/components/JobCard"
import { JobGridAnimation } from "@/components/JobGridAnimation"
import { StudentSidebar } from "@/components/StudentSidebar"

export default async function StudentDashboard({ searchParams }: { searchParams: { q?: string } }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  const query = searchParams.q || ''
  
  // 1. Fetch Current User
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Fetch User Profile (For Eligibility)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // 3. ✅ FETCH APPLIED JOBS (New Step)
  // We get a list of all job_ids this student has already applied to
  const { data: existingApplications } = await supabase
    .from('applications')
    .select('job_id')
    .eq('student_id', user?.id)

  // Convert to a simple array of IDs: ['job-123', 'job-456']
  const appliedJobIds = existingApplications?.map(app => app.job_id) || []

  // 4. Fetch Jobs
  let dbQuery = supabase.from('jobs').select('*').order('created_at', { ascending: false })
  if (query) dbQuery = dbQuery.ilike('title', `%${query}%`)
  const { data: jobs } = await dbQuery

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
  <StudentSidebar />
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-8 py-8">
           <h1 className="text-3xl font-bold">Find Jobs</h1>
           <p className="text-gray-500">Welcome, {profile?.full_name || "Student"}</p>
        </div>

        <div className="p-8 max-w-7xl">
            <JobGridAnimation>
              {jobs?.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  userProfile={profile}
                  // ✅ Pass the "Already Applied" status to the card
                  hasApplied={appliedJobIds.includes(job.id)} 
                />
              ))}
            </JobGridAnimation>
        </div>
      </div>
    </div>
  )
}