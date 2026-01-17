'use client'

import { registerAction } from "@/actions/register"
import { useState } from "react"
import { GraduationCap, Mail, Lock, User, Hash, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function RegisterForm({ colleges }: { colleges: any[] }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await registerAction(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Account created! Please login.")
      // Optional: Redirect to login
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Full Name */}
      <div className="relative">
        <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input 
          name="fullName" 
          placeholder="Full Name (As per College Records)" 
          required 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" 
        />
      </div>

      {/* 2. PRN Number (Crucial for Industrial Projects) */}
      <div className="relative">
        <Hash className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input 
          name="prnNumber" 
          placeholder="University PRN / ID" 
          required 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" 
        />
      </div>

      {/* 3. College Selection (FIXED SELECT WARNING) */}
      <div className="relative">
        <GraduationCap className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <select 
          name="collegeId" 
          required 
          defaultValue="" // ✅ FIXED: Use defaultValue here
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none appearance-none"
        >
          <option value="" disabled>Choose your campus...</option> {/* ✅ REMOVED 'selected' */}
          {colleges.map((college) => (
            <option key={college.id} value={college.id}>
              {college.name}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input 
          name="email" 
          type="email" 
          placeholder="Official Email Address" 
          required 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" 
        />
      </div>

      {/* 5. Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input 
          name="password" 
          type="password" 
          placeholder="Create Password" 
          required 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Student Account"}
      </button>
    </form>
  )
}