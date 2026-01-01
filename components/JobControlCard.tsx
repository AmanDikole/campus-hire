'use client'

import { toast } from "sonner" // ✅ Import Sonner
import { useState } from "react"
import { toggleJobStatus } from "@/actions/toggle-job-status"
import { Building2, Users, Calendar, Power, Eye, Loader2 } from "lucide-react"
import Link from "next/link"

export function JobControlCard({ job, applicantCount }: { job: any, applicantCount: number }) {
  const [loading, setLoading] = useState(false)

  const handleToggleStatus = async () => {
    // Optional: You can use toast.promise() for even better UX, but let's keep it simple
    setLoading(true)
    const result = await toggleJobStatus(job.id, job.is_active)
    
    if (!result.success) {
      toast.error(result.error) // ✅ Toast Error
    } else {
      const statusMsg = job.is_active ? "Drive Closed" : "Drive Activated"
      toast.success(statusMsg) // ✅ Toast Success
    }
    setLoading(false)
  }

  // ... rest of the component (JSX) stays exactly the same ...
  return (
    <div className={`group bg-white rounded-2xl p-6 border transition-all hover:shadow-lg ${job.is_active ? 'border-gray-200' : 'border-gray-100 bg-gray-50/50'}`}>
        {/* ... (Keep your JSX code) ... */}
        
        {/* Header: Company & Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border ${job.is_active ? 'bg-white border-gray-100 shadow-sm text-black' : 'bg-gray-100 text-gray-400 border-transparent'}`}>
            {job.company.charAt(0)}
          </div>
          <div>
            <h3 className={`font-bold text-lg leading-tight ${job.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Building2 size={14} />
              <span>{job.company}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
          job.is_active 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${job.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {job.is_active ? 'Active' : 'Closed'}
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 mb-4">
        <div className="flex items-center gap-3">
           <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Users size={18} /></div>
           <div>
             <p className="text-xs text-gray-400 font-medium uppercase">Applicants</p>
             <p className="font-bold text-gray-900">{applicantCount}</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><Calendar size={18} /></div>
           <div>
             <p className="text-xs text-gray-400 font-medium uppercase">Posted On</p>
             <p className="font-bold text-gray-900">{new Date(job.created_at).toLocaleDateString()}</p>
           </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* View Candidates Button */}
        <Link 
          href={`/admin/students?jobId=${job.id}`}
          className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition flex justify-center items-center gap-2"
        >
          <Eye size={16} /> View Candidates
        </Link>

        {/* Close/Activate Button */}
        <button 
          onClick={handleToggleStatus}
          disabled={loading}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 ${
            job.is_active 
              ? 'border-red-100 text-red-600 hover:bg-red-50' 
              : 'border-green-100 text-green-600 hover:bg-green-50'
          }`}
          title={job.is_active ? "Close Drive" : "Re-activate Drive"}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Power size={18} />}
        </button>
      </div>
    </div>
  )
}