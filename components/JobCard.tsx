'use client'

import { useState } from "react"
import { Building2, MapPin, Banknote, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"
import { applyForJob } from "@/actions/apply-job"

export function JobCard({ job, userProfile, hasApplied }: { job: any, userProfile: any, hasApplied: boolean }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' })

  const handleApply = async () => {
    if (!userProfile) return alert("Please log in first")
    
    setLoading(true)
    setStatus({ type: null, msg: '' }) // Reset status

    const result = await applyForJob(job.id, userProfile.id)

    if (result.success) {
      setStatus({ type: 'success', msg: result.message })
    } else {
      setStatus({ type: 'error', msg: result.message })
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group flex flex-col h-full">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl font-bold text-gray-900 border border-gray-100 group-hover:scale-105 transition-transform">
          {job.company.charAt(0)}
        </div>
        {hasApplied ? (
            <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-bold border border-green-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> Applied
            </span>
        ) : (
            <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">
                {new Date(job.created_at).toLocaleDateString()}
            </span>
        )}
      </div>

      {/* Details */}
      <div className="mb-6 flex-1">
        <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{job.title}</h3>
        <p className="text-sm text-gray-500 font-medium mb-4">{job.company}</p>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400" /> {job.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Banknote size={16} className="text-gray-400" /> {job.salary}
          </div>
          
          {/* Eligibility Hint */}
          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-lg mt-2">
            <Clock size={12} /> 
            Min CGPA: {job.min_cgpa} • {job.eligible_gender === 'Any' ? 'All Genders' : job.eligible_gender}
          </div>
        </div>
      </div>

      {/* Apply Button / Status Message */}
      <div className="mt-auto pt-4 border-t border-gray-50">
        
        {/* Error/Success Message Display */}
        {status.msg && (
            <div className={`text-xs p-3 rounded-lg mb-3 flex items-start gap-2 ${
                status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
                {status.type === 'success' ? <CheckCircle2 size={16} className="shrink-0"/> : <AlertCircle size={16} className="shrink-0"/>}
                <span>{status.msg}</span>
            </div>
        )}

        {hasApplied || status.type === 'success' ? (
           <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed">
             Application Sent
           </button>
        ) : (
          <button 
            onClick={handleApply} 
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all flex justify-center items-center gap-2 shadow-lg shadow-gray-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Apply Now"}
          </button>
        )}
      </div>
    </div>
  )
}