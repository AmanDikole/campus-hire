'use client'

import { registerAction } from "@/actions/register"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Mail, Lock, School } from "lucide-react"

export function RegisterForm({ colleges }: { colleges: { id: string, name: string }[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await registerAction(formData)

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success("Account created! Please log in.")
      router.push('/login')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* College Dropdown */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 ml-1">Select College</label>
        <div className="relative">
          <School className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <select 
            name="collegeId" 
            required 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none appearance-none"
          >
            <option value="" disabled selected>Choose your campus...</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.id}>{college.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input 
            name="email" 
            type="email" 
            required 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" 
            placeholder="student@college.edu" 
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input 
            name="password" 
            type="password" 
            required 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none" 
            placeholder="••••••••" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 mt-2"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? "Creating Account..." : "Sign Up"}
      </button>

    </form>
  )
}
