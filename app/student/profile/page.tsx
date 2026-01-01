'use client' // Switch to Client Component to handle state easily

import { createClient } from "@/lib/supabase"
import { StudentSidebar } from "@/components/StudentSidebar"
import { ResumeUpload } from "@/components/ResumeUpload" // ✅ Import
import { User, GraduationCap, Link as LinkIcon, Save, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StudentProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [resumeUrl, setResumeUrl] = useState("") // ✅ State for Resume URL
  const supabase = createClient()
  const router = useRouter()

  // Fetch Profile on Load
  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
        setResumeUrl(data?.resume_url || "") // Set initial URL
      }
      setLoading(false)
    }
    getProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const updates = {
      full_name: formData.get('full_name'),
      gender: formData.get('gender'),
      branch: formData.get('branch'),
      cgpa: parseFloat(formData.get('cgpa') as string) || 0,
      percent_10th: parseFloat(formData.get('percent_10th') as string) || 0,
      percent_12th: parseFloat(formData.get('percent_12th') as string) || 0,
      linkedin_url: formData.get('linkedin_url'),
      portfolio_url: formData.get('portfolio_url'),
      resume_url: resumeUrl, // ✅ Save the URL from state
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)

    if (error) {
      alert("Error: " + error.message)
    } else {
      alert("Profile updated successfully!")
      router.refresh()
    }
    setSaving(false)
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin"/></div>

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <StudentSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Personal Information */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><User className="text-blue-500" /> Personal Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input name="full_name" defaultValue={profile?.full_name} className="w-full p-3 border rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Gender</label>
                    <select name="gender" defaultValue={profile?.gender || "Male"} className="w-full p-3 border rounded-xl bg-white">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                 </div>
               </div>
            </div>

            {/* 2. Academic Information */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><GraduationCap className="text-purple-500" /> Academic Record</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Branch</label>
                    <select name="branch" defaultValue={profile?.branch || "CSE"} className="w-full p-3 border rounded-xl bg-white">
                        {["CSE", "IT", "ECE", "MECH", "CIVIL", "EEE", "AI&DS"].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Current CGPA</label>
                    <input name="cgpa" type="number" step="0.01" defaultValue={profile?.cgpa} className="w-full p-3 border rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">10th %</label>
                    <input name="percent_10th" type="number" step="0.01" defaultValue={profile?.percent_10th} className="w-full p-3 border rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">12th %</label>
                    <input name="percent_12th" type="number" step="0.01" defaultValue={profile?.percent_12th} className="w-full p-3 border rounded-xl" />
                 </div>
               </div>
            </div>

            {/* 3. Resume & Social Links */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><LinkIcon className="text-green-500" /> Documents & Links</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 
                 {/* ✅ NEW: Resume Uploader */}
                 <ResumeUpload 
                    currentUrl={resumeUrl} 
                    onUploadComplete={(url) => setResumeUrl(url)} 
                 />

                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">LinkedIn URL</label>
                        <input name="linkedin_url" defaultValue={profile?.linkedin_url} className="w-full p-3 border rounded-xl" placeholder="https://linkedin.com/in..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Portfolio URL</label>
                        <input name="portfolio_url" defaultValue={profile?.portfolio_url} className="w-full p-3 border rounded-xl" placeholder="https://github.com..." />
                    </div>
                 </div>
               </div>
            </div>

            <div className="flex justify-end pb-12">
                <button type="submit" disabled={saving} className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition flex items-center gap-2 shadow-xl shadow-gray-200">
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}