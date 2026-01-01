import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { AdminSidebar } from "@/components/AdminSidebar"
import { ApplicationRow } from "@/components/ApplicationRow"
import { AdminFilterBar } from "@/components/AdminFilterBar"
import { ExportButton } from "@/components/ExportButton"

export default async function AdminStudents({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string; status?: string }>
}) {
  // ✅ Next.js 15: Must await params
  const params = await searchParams
  const { jobId, status } = params

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  // Fetch Jobs & Applications
  const { data: jobs } = await supabase.from('jobs').select('id, title, company')

  let query = supabase
    .from('applications')
    .select(`*, jobs (title, company), profiles (full_name, branch, cgpa, resume_url)`)
    .order('created_at', { ascending: false })

  if (jobId) query = query.eq('job_id', jobId)
  if (status) query = query.eq('status', status)

  const { data: applications, error } = await query

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h1 className="text-3xl font-bold">Applicant Review</h1>
            <ExportButton data={applications || []} />
          </div>

          <AdminFilterBar jobs={jobs || []} />

          {error && <div className="text-red-500 bg-red-50 p-4 mb-4 rounded">DB Error: {error.message}</div>}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Academics</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Resume</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications?.map((app: any) => (
                    <ApplicationRow key={app.id} app={app} />
                  ))}
                </tbody>
              </table>
            </div>
            {!applications?.length && !error && (
              <div className="p-12 text-center text-gray-500">No applications found.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}