import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { AdminSidebar } from "@/components/AdminSidebar"
import { AdminFilterBar } from "@/components/AdminFilterBar"
import { ExportButton } from "@/components/ExportButton"
import { StudentTable } from "@/components/StudentTable" // ✅ Import new component

export default async function AdminStudents({
  searchParams,
}: {
  searchParams: { jobId?: string; status?: string }
}) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  // 1. Fetch Jobs for Dropdown
  const { data: jobs } = await supabase.from('jobs').select('id, title, company')

  // 2. Build Query
  let query = supabase
    .from('applications')
    .select(`
      *,
      jobs (title, company),
      profiles (full_name, branch, cgpa, resume_url)
    `)
    .order('created_at', { ascending: false })

  if (searchParams.jobId) query = query.eq('job_id', searchParams.jobId)
  if (searchParams.status) query = query.eq('status', searchParams.status)

  const { data: applications } = await query

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Applicant Review</h1>
              <p className="text-gray-500 mt-2">Real-time application monitoring.</p>
            </div>
            
            <ExportButton data={applications || []} />
          </div>

          <AdminFilterBar jobs={jobs || []} />

          {/* ✅ Use the Real-Time Table Component */}
          <StudentTable initialApplications={applications || []} />

        </div>
      </main>
    </div>
  )
}