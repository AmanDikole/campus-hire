'use client'

import { applyForJob } from "@/actions/apply-job"
import { Building2, MapPin, Banknote, Calendar, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface JobCardProps {
  job: any
  userProfile: any
  hasApplied: boolean
}

export function JobCard({ job, userProfile, hasApplied }: JobCardProps) {
  const [loading, setLoading] = useState(false)
  const [isApplied, setIsApplied] = useState(hasApplied)

  // 1. Eligibility Check Logic
  const isEligible = () => {
    if (!userProfile) return false
    if (userProfile.cgpa < job.minCgpa) return false
    if (userProfile.percent10th < job.min10thPercent) return false
    if (userProfile.percent12th < job.min12thPercent) return false
    // Check Branch (if job has restrictions)
    if (job.eligibleBranches && job.eligibleBranches.length > 0) {
      if (!job.eligibleBranches.includes(userProfile.branch)) return false
    }
    return true
  }

  const eligible = isEligible()

  const handleApply = async () => {
    setLoading(true)
    const result = await applyForJob(job.id)
    
    if (result.success) {
      toast.success(result.success)
      setIsApplied(true)
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-full">
      
      {/* Header */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-900 border border-gray-100">
            {job.company.charAt(0)}
          </div>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
            {job.eligibleBranches?.length > 0 ? job.eligibleBranches.join(", ") : "All Branches"}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
        <p className="text-gray-500 font-medium text-sm mb-4">{job.company}</p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400" /> {job.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Banknote size={16} className="text-green-500" /> {job.salary}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-blue-500" /> Posted {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-gray-100">
        {!isApplied ? (
          <button
            onClick={handleApply}
            disabled={!eligible || loading}
            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              eligible 
                ? "bg-black text-white hover:bg-zinc-800 shadow-lg shadow-gray-200" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {!eligible ? "Not Eligible" : loading ? "Applying..." : "Apply Now"}
          </button>
        ) : (
          <button disabled className="w-full py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default">
            <CheckCircle size={18} /> Applied
          </button>
        )}
        
        {!eligible && !isApplied && (
           <p className="text-center text-xs text-red-500 mt-2 font-medium">
             Criteria not met (CGPA/Branch)
           </p>
        )}
      </div>
    </div>
  )
}