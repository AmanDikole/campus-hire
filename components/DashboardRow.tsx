'use client'

import { useState } from "react"
import { updateStatus } from "@/actions/update-status" // Reuse your existing server action
import { Check, X, Loader2, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export function DashboardRow({ app }: { app: any }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(app.status || 'Pending')

  const handleUpdate = async (newStatus: string) => {
    setLoading(true)
    // Call the server action we created earlier
    const result = await updateStatus(app.id, newStatus)
    if (result.success) {
      setStatus(newStatus)
    } else {
      alert("Failed to update")
    }
    setLoading(false)
  }

  // Status Badge Styles
  const statusStyles: any = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'Shortlisted': 'bg-blue-50 text-blue-700 border-blue-100',
    'Rejected': 'bg-red-50 text-red-700 border-red-100',
    'Selected': 'bg-green-50 text-green-700 border-green-100'
  }

  return (
    <tr className="group hover:bg-gray-50/80 transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                {app.student_email.substring(0, 2)}
            </div>
            <div>
                <p className="font-semibold text-gray-900">{app.profiles?.full_name || app.student_email.split('@')[0]}</p>
                <p className="text-xs text-gray-500">{app.student_email}</p>
            </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex flex-col">
            <span className="font-medium text-gray-900">{app.jobs?.title}</span>
            <span className="text-xs text-gray-500">{app.jobs?.company}</span>
        </div>
      </td>
      <td className="px-8 py-5 text-gray-500">
        {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </td>
      <td className="px-8 py-5">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || statusStyles['Pending']}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'Pending' ? 'bg-yellow-500' : 'bg-current'}`}></span>
            {status}
        </span>
      </td>
      <td className="px-8 py-5 text-right">
        {loading ? (
            <Loader2 className="animate-spin ml-auto text-gray-400" size={18} />
        ) : status === 'Pending' ? (
            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* REJECT BUTTON */}
                <button 
                    onClick={() => handleUpdate('Rejected')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Reject"
                >
                    <X size={18} />
                </button>
                
                {/* SHORTLIST BUTTON */}
                <button 
                    onClick={() => handleUpdate('Shortlisted')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Shortlist"
                >
                    <Check size={18} />
                </button>
            </div>
        ) : (
            <span className="text-xs text-gray-400 font-medium">Processed</span>
        )}
      </td>
    </tr>
  )
}