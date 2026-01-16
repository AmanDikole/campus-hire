'use client'

import { updateStatus } from "@/actions/update-status"
import { Check, X, FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function ApplicationRow({ app }: { app: any }) {
  const [loading, setLoading] = useState(false)

  // ✅ Helper to Safely Access Nested Prisma Data
  // Prisma Structure: app -> student -> profile
  const profile = app.student?.profile || {}
  const job = app.job || {}

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    const result = await updateStatus(app.id, newStatus)
    
    if (result.success) {
      toast.success(`Candidate ${newStatus}`)
    } else {
      toast.error("Failed to update status")
    }
    setLoading(false)
  }

  // Status Badge Logic
  const statusColors: any = {
    'Pending': 'text-yellow-700 bg-yellow-50 border-yellow-200',
    'Shortlisted': 'text-blue-700 bg-blue-50 border-blue-200',
    'Rejected': 'text-red-700 bg-red-50 border-red-200',
    'Selected': 'text-green-700 bg-green-50 border-green-200',
  }

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      
      {/* 1. Candidate Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
            {profile.fullName?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-bold text-gray-900">{profile.fullName || "Unknown"}</p>
            <p className="text-xs text-gray-500">{app.student?.email || "No Email"}</p>
          </div>
        </div>
      </td>

      {/* 2. Academics */}
      <td className="px-6 py-4 text-gray-600">
        <div className="flex flex-col gap-1 text-xs">
           <span className="font-medium bg-gray-100 w-fit px-1.5 py-0.5 rounded text-gray-700">{profile.branch || "N/A"}</span>
           <span>CGPA: <span className="font-semibold text-gray-900">{profile.cgpa || "-"}</span></span>
        </div>
      </td>

      {/* 3. Role */}
      <td className="px-6 py-4">
        <p className="font-medium text-gray-900 text-sm">{job.title}</p>
        <p className="text-xs text-gray-500">{job.company}</p>
      </td>

      {/* 4. Resume Link */}
      <td className="px-6 py-4">
        {profile.resumeUrl ? (
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline border border-blue-100 bg-blue-50 px-2 py-1 rounded-lg">
            <FileText size={12} /> View Resume
          </a>
        ) : (
          <span className="text-xs text-gray-400 italic">Not uploaded</span>
        )}
      </td>

      {/* 5. Status Badge */}
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${statusColors[app.status] || 'text-gray-600 bg-gray-100'}`}>
          {app.status}
        </span>
      </td>

      {/* 6. Actions */}
      <td className="px-6 py-4 text-right">
        {app.status === 'Pending' && (
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => handleStatusChange('Shortlisted')} 
              disabled={loading}
              className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100 transition disabled:opacity-50" 
              title="Shortlist"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            </button>
            <button 
              onClick={() => handleStatusChange('Rejected')} 
              disabled={loading}
              className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition disabled:opacity-50" 
              title="Reject"
            >
               {loading ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
            </button>
          </div>
        )}
        {app.status === 'Shortlisted' && (
           <button 
             onClick={() => handleStatusChange('Selected')}
             disabled={loading}
             className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition disabled:opacity-50"
           >
             {loading ? "Processing..." : "Mark Selected"}
           </button>
        )}
      </td>
    </tr>
  )
}