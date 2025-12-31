'use client'
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { AdminSidebar } from "@/components/AdminSidebar"
import { 
  Building2, MapPin, Banknote, Briefcase, 
  ArrowLeft, Loader2, CheckCircle2, Type,
  GraduationCap, Scale
} from "lucide-react"

export default function PostJob() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  
  // State for multi-select branches
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const branches = ["CSE", "IT", "ECE", "MECH", "CIVIL"]

  const toggleBranch = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      setSelectedBranches(selectedBranches.filter(b => b !== branch))
    } else {
      setSelectedBranches([...selectedBranches, branch])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const { error } = await supabase.from('jobs').insert([{
      title: formData.get('title'),
      company: formData.get('company'),
      location: formData.get('location'),
      salary: formData.get('salary'),
      description: formData.get('description'),
      
      // ✅ NEW: Save Criteria
      min_cgpa: parseFloat(formData.get('min_cgpa') as string) || 0,
      eligible_branches: selectedBranches
    }])

    if (error) {
      alert("Error: " + error.message)
    } else {
      setTimeout(() => { router.push('/admin/dashboard'); router.refresh() }, 500)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header & Back Button... (Keep same as before) */}
          <Link href="/admin/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900"><ArrowLeft size={16} className="mr-2" /> Back</Link>
          <h1 className="text-3xl font-bold mb-8">Post Job with Criteria</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-8">
            
            {/* ... Keep Title, Company, Location, Salary inputs exactly as before ... */}
            <div className="space-y-2">
                <label className="text-sm font-semibold">Job Title</label>
                <input name="title" required className="w-full p-3 border rounded-xl" placeholder="SDE I" />
            </div>
             <div className="grid grid-cols-2 gap-6">
                <input name="company" required className="p-3 border rounded-xl" placeholder="Company" />
                <input name="location" required className="p-3 border rounded-xl" placeholder="Location" />
             </div>
             <input name="salary" required className="w-full p-3 border rounded-xl" placeholder="Salary (e.g. 12 LPA)" />

            {/* ✅ NEW: ELIGIBILITY SECTION */}
            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-6">
              <h3 className="font-bold text-blue-900 flex items-center gap-2">
                <Scale size={18} /> Eligibility Criteria
              </h3>

              {/* Min CGPA */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Minimum CGPA</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    name="min_cgpa" 
                    type="number" 
                    step="0.1" 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500" 
                    placeholder="e.g. 7.5" 
                  />
                </div>
              </div>

              {/* Eligible Branches */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Eligible Branches</label>
                <div className="flex flex-wrap gap-2">
                  {branches.map(branch => (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => toggleBranch(branch)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedBranches.includes(branch) 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="branches" value={JSON.stringify(selectedBranches)} />
              </div>
            </div>

            {/* Description */}
            <textarea name="description" required className="w-full p-3 border rounded-xl h-32" placeholder="Job Description..." />

            <div className="flex justify-end">
               <button type="submit" disabled={loading} className="bg-black text-white px-8 py-3 rounded-xl font-medium">
                 {loading ? "Posting..." : "Publish Job"}
               </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}