'use client'

import { toast } from "sonner" // ✅ Import Sonner
import { useState } from "react"
import { Check, X, Loader2, FileText } from "lucide-react"
import { updateStatus } from "@/actions/update-status"

export function ApplicationRow({ app }: { app: any }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(app.status || 'Pending')

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    const result = await updateStatus(app.id, newStatus)
    if (result.success) {
      setStatus(newStatus)
      toast.success(`Candidate ${newStatus} successfully`) // ✅ Toast Success
    } else {
      toast.error("Error: " + result.error) // ✅ Toast Error
    }
    setLoading(false)
  }

  const statusColors: any = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Shortlisted': 'bg-blue-50 text-blue-700 border-blue-200',
    'Rejected': 'bg-red-50 text-red-700 border-red-200',
    'Selected': 'bg-green-50 text-green-700 border-green-200',
  }

  // ... keep JSX exactly same ...
  return (
    <tr className="group hover:bg-gray-50 transition-colors">
        {/* ... (Keep your existing Table Data Cells <td>...</td>) ... */}
        
        {/* 1. Candidate Info */}
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-gray-900">{app.profiles?.full_name || "Unknown"}</p>
          <p className="text-xs text-gray-500">{app.student_email}</p>
        </div>
      </td>

      {/* 2. Academics */}
      <td className="px-6 py-4">
        <div className="text-sm">
          <p><span className="text-gray-500">Branch:</span> {app.profiles?.branch || "N/A"}</p>
          <p><span className="text-gray-500">CGPA:</span> {app.profiles?.cgpa || "N/A"}</p>
        </div>
      </td>

      {/* 3. Job Info */}
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{app.jobs?.title}</p>
          <p className="text-xs text-gray-500">{app.jobs?.company}</p>
        </div>
      </td>

      {/* 4. Resume Link */}
      <td className="px-6 py-4">
        {app.profiles?.resume_url ? (
          <a 
            href={app.profiles.resume_url} 
            target="_blank" 
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
          >
            <FileText size={16} /> View PDF
          </a>
        ) : (
          <span className="text-gray-400 text-sm italic">No Resume</span>
        )}
      </td>

      {/* 5. Status Badge */}
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[status]}`}>
          {status}
        </span>
      </td>

      {/* 6. Action Buttons */}
      <td className="px-6 py-4 text-right">
        {loading ? (
          <Loader2 className="animate-spin ml-auto text-gray-400" size={20} />
        ) : (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {status === 'Pending' && (
              <>
                <button 
                  onClick={() => handleStatusChange('Rejected')}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100 transition"
                  title="Reject"
                >
                  <X size={16} />
                </button>
                <button 
                  onClick={() => handleStatusChange('Shortlisted')}
                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 border border-green-100 transition"
                  title="Shortlist"
                >
                  <Check size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}