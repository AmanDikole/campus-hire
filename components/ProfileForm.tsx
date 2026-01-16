'use client'

import { updateProfileAction } from "@/actions/update-profile"
import { User, BookOpen, GraduationCap, Link as LinkIcon, Save, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateProfileAction(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
      
      {/* Personal Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-2">
            <User className="text-blue-500" size={20} /> Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input name="fullName" defaultValue={profile.fullName} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Branch</label>
                <select name="branch" defaultValue={profile.branch || ""} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none">
                    <option value="" disabled>Select Branch</option>
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="ECE">Electronics (ECE)</option>
                    <option value="MECH">Mechanical</option>
                    <option value="CIVIL">Civil</option>
                    <option value="AI&DS">AI & DS</option>
                </select>
            </div>
        </div>
      </div>

      {/* Academic Scores */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-2">
            <GraduationCap className="text-purple-500" size={20} /> Academic Scores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Current CGPA</label>
                <input name="cgpa" type="number" step="0.01" defaultValue={profile.cgpa} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">10th %</label>
                <input name="percent10th" type="number" step="0.01" defaultValue={profile.percent10th} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">12th / Diploma %</label>
                <input name="percent12th" type="number" step="0.01" defaultValue={profile.percent12th} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" />
            </div>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-2">
            <LinkIcon className="text-emerald-500" size={20} /> Portfolio & Resume
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Resume Link (Google Drive/PDF)</label>
                <input name="resumeUrl" type="url" defaultValue={profile.resumeUrl} placeholder="https://..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">LinkedIn Profile</label>
                <input name="linkedinUrl" type="url" defaultValue={profile.linkedinUrl} placeholder="https://linkedin.com/in/..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" />
            </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button 
            type="submit" 
            disabled={loading}
            className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
        >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Profile
        </button>
      </div>

    </form>
  )
}