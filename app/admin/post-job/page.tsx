'use client'

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { postJobAction } from "@/actions/post-job" // ✅ Import our new action
import Link from "next/link"
import { AdminSidebar } from "@/components/AdminSidebar"
import { ArrowLeft, Scale, GraduationCap, Users, BookOpen, ScrollText, Percent, Loader2 } from "lucide-react"

export default function PostJob() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Local state for UI selection
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [selectedGender, setSelectedGender] = useState<string>("Any")
  
  const branches = ["CSE", "IT", "ECE", "MECH", "CIVIL", "EEE", "AI&DS"]
  const genders = ["Any", "Male", "Female"]

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
    
    // ✅ Append our complex state to formData before sending
    formData.set('eligible_branches', JSON.stringify(selectedBranches))
    formData.set('eligible_gender', selectedGender)

    const result = await postJobAction(formData)

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success(result.success)
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            
            <Link href="/admin/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Post New Drive</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-8">
                
                 {/* BASIC JOB DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-sm font-semibold text-gray-700">Job Title</label>
                        <input name="title" required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" placeholder="e.g. Graduate Trainee Engineer" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-sm font-semibold text-gray-700">Salary (CTC)</label>
                        <input name="salary" required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" placeholder="e.g. 8 LPA" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Company Name</label>
                        <input name="company" required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" placeholder="e.g. Microsoft" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Location</label>
                        <input name="location" required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" placeholder="e.g. Bangalore / Remote" />
                    </div>
                </div>

                {/* ADVANCED ELIGIBILITY CRITERIA */}
                <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-6">
                <h3 className="font-bold text-indigo-900 flex items-center gap-2 pb-2 border-b border-indigo-100">
                    <Scale size={20} /> Eligibility Criteria
                </h3>

                {/* Row 1: Branches & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Branches */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><BookOpen size={16}/> Eligible Branches</label>
                        <div className="flex flex-wrap gap-2">
                        {branches.map(branch => (
                            <button
                            key={branch}
                            type="button"
                            onClick={() => toggleBranch(branch)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                selectedBranches.includes(branch) 
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                                : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                            }`}
                            >
                            {branch}
                            </button>
                        ))}
                        </div>
                        {selectedBranches.length === 0 && <p className="text-xs text-red-500">* Select at least one</p>}
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Users size={16}/> Gender Preference</label>
                        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 w-fit">
                            {genders.map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setSelectedGender(g)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        selectedGender === g 
                                        ? "bg-indigo-100 text-indigo-700 shadow-sm" 
                                        : "text-gray-500 hover:text-gray-900"
                                    }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Row 2: Academic Cutoffs */}
                <div className="space-y-3 pt-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Percent size={16}/> Minimum Academic Scores</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ScoreInput name="min_cgpa" label="Current CGPA" icon={GraduationCap} placeholder="6.5" />
                        <ScoreInput name="min_10th" label="10th %" icon={ScrollText} placeholder="60" />
                        <ScoreInput name="min_12th" label="12th %" icon={ScrollText} placeholder="60" />
                        {/* Note: Prisma schema might not have diploma, so this is optional in logic */}
                        <ScoreInput name="min_diploma" label="Diploma %" icon={ScrollText} placeholder="Optional" />
                    </div>
                </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Job Description</label>
                    <textarea 
                        name="description" 
                        required 
                        className="w-full p-4 border border-gray-200 rounded-xl h-40 focus:ring-2 focus:ring-black/5 outline-none resize-none" 
                        placeholder="Roles, Responsibilities, and perks..." 
                    />
                </div>

                {/* SUBMIT */}
                <div className="flex justify-end pt-4">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="bg-black text-white px-10 py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? "Posting..." : "Publish Job Drive"}
                </button>
                </div>
            </form>
        </div>
      </main>
    </div>
  )
}

function ScoreInput({ name, label, icon: Icon, placeholder }: { name: string; label: string; icon: React.ComponentType<{ className?: string; size?: number }>; placeholder: string }) {
    return (
        <div className="space-y-1">
            <span className="text-xs text-gray-500 font-medium ml-1">{label}</span>
            <div className="relative">
                <Icon className="absolute left-3 top-3 text-indigo-400" size={16} />
                <input 
                    name={name} 
                    type="number" 
                    step="0.01"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-indigo-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    placeholder={placeholder} 
                />
            </div>
        </div>
    )
}