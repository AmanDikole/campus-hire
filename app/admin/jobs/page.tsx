import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { AdminSidebar } from "@/components/AdminSidebar"
import { JobControlCard } from "@/components/JobControlCard"// We create this next
import { Plus, Briefcase } from "lucide-react"
import Link from "next/link"

export default async function ManageJobs() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  // Fetch Jobs with Application Counts
  // We use a "sub-query" count trick or just fetch all and map
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, applications(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Drives</h1>
              <p className="text-gray-500 mt-2">Control active job listings and monitor responses.</p>
            </div>
            
            <Link href="/admin/post-job" className="bg-black text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-zinc-800 transition shadow-lg shadow-gray-200">
              <Plus size={18} /> Post New Drive
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs?.map((job: any) => (
              <JobControlCard 
                key={job.id} 
                job={job} 
                applicantCount={job.applications?.[0]?.count || 0} 
              />
            ))}
            
            {jobs?.length === 0 && (
              <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <Briefcase className="mx-auto text-gray-300 mb-3" size={32} />
                <p className="text-gray-500">No jobs posted yet.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}