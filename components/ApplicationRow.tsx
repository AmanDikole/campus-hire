'use client'
import { useState } from "react"
import { updateStatus } from "@/actions/update-status"
import { Check, X, Loader2, FileText, Download } from "lucide-react"

export function ApplicationRow({ app }: { app: any }) {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (newStatus: string) => {
    if (confirm(`Mark this student as ${newStatus}?`)) {
      setLoading(true)
      await updateStatus(app.id, newStatus)
      setLoading(false)
    }
  }

  const statusColors: any = {
    'Pending': 'bg-yellow-50 text-yellow-700',
    'Shortlisted': 'bg-blue-50 text-blue-700',
    'Rejected': 'bg-red-50 text-red-700',
    'Selected': 'bg-green-50 text-green-700'
  }

  // Safe access to profile data (it might be null if student hasn't created profile)
  const profile = app.profiles || {}

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      
      {/* 1. Candidate Info */}
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{profile.full_name || "Unknown"}</p>
          <p className="text-xs text-gray-500">{app.student_email}</p>
        </div>
      </td>

      {/* 2. Academics (CGPA / Branch) */}
      <td className="px-6 py-4">
        {profile.branch ? (
          <div>
            <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-700 mr-2">
              {profile.branch}
            </span>
            <span className="text-gray-600 font-medium">{profile.cgpa} CGPA</span>
          </div>
        ) : (
          <span className="text-gray-400 italic">No Profile</span>
        )}
      </td>

      {/* 3. Job Info */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{app.jobs?.title}</span>
          <span className="text-xs text-gray-500">{app.jobs?.company}</span>
        </div>
      </td>

      {/* 4. Resume Link */}
      <td className="px-6 py-4">
        {profile.resume_url ? (
          <a 
            href={profile.resume_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm group"
          >
            <FileText size={16} />
            <span>View PDF</span>
            <Download size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ) : (
          <span className="text-gray-400 text-xs">Not Uploaded</span>
        )}
      </td>

      {/* 5. Status Badge */}
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
          {app.status || 'Pending'}
        </span>
      </td>

      {/* 6. Action Buttons */}
      <td className="px-6 py-4 text-right">
        {loading ? (
          <Loader2 className="animate-spin ml-auto text-gray-400" size={18} />
        ) : (
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => handleUpdate('Rejected')}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip"
              title="Reject"
            >
              <X size={18} />
            </button>
            <button 
              onClick={() => handleUpdate('Shortlisted')}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors tooltip"
              title="Shortlist"
            >
              <Check size={18} />
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}