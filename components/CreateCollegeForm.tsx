'use client'

import { createCollegeAction } from "@/actions/create-college"
import { Loader2, Building2, Globe, MapPin, Mail, Lock, ArrowRight } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function CreateCollegeForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await createCollegeAction(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
      e.currentTarget.reset()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Section 1: College Details */}
      <div className="space-y-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Organization</label>
        
        <div className="relative">
          <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            name="name" 
            required 
            placeholder="College Name (e.g. Harvard University)" 
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none transition-all" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              name="subdomain" 
              required 
              placeholder="Subdomain ID" 
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none transition-all" 
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              name="location" 
              required 
              placeholder="Location" 
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none transition-all" 
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 my-4"></div>

      {/* Section 2: Admin Access */}
      <div className="space-y-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Admin Account</label>
        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              name="adminEmail" 
              type="email" 
              required 
              placeholder="Administrator Email" 
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none transition-all" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              name="adminPassword" 
              type="text" 
              required 
              placeholder="Set Initial Password" 
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none transition-all" 
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-black text-white font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : (
          <>Initialize Tenant <ArrowRight size={16} /></>
        )}
      </button>
    </form>
  )
}