'use client'
import { useState } from "react"
import { toggleJobStatus, deleteJob } from "@/actions/job-actions"
import { Trash2, Users, MapPin, Calendar, Power, Loader2, Eye } from "lucide-react"

export function JobControlCard({ job, applicantCount }: { job: any, applicantCount: number }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await toggleJobStatus(job.id, job.is_active)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure? This will delete the job and ALL associated applications permanently.")) {
      setLoading(true)
      await deleteJob(job.id)
      setLoading(false)
    }
  }

  return (
    <div className={`p-6 rounded-2xl border transition-all relative ${
      job.is_active 
        ? "bg-white border-gray-200 shadow-sm" 
        : "bg-gray-50 border-gray-200 opacity-80"
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{job.title}</h3>
          <p className="text-sm text-gray-500 font-medium">{job.company}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
          job.is_active 
            ? "bg-green-50 text-green-700 border-green-200 flex items-center gap-1" 
            : "bg-gray-200 text-gray-600 border-gray-300"
        }`}>
          {job.is_active ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> Active</> : "Closed"}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
          <Users size={14} className="text-blue-500" />
          <span className="font-semibold text-gray-900">{applicantCount}</span> Applicants
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-gray-400" /> {job.location}
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        
        {/* Toggle Switch Button */}
        <button 
          onClick={handleToggle}
          disabled={loading}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
             job.is_active 
               ? "text-orange-600 hover:bg-orange-50" 
               : "text-green-600 hover:bg-green-50"
          }`}
        >
          {loading ? <Loader2 size={14} className="animate-spin"/> : <Power size={14} />}
          {job.is_active ? "Close Drive" : "Activate Drive"}
        </button>

        <div className="flex gap-2">
          {/* Delete Button */}
          <button 
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Job"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}