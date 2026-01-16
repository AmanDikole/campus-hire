'use client'

import { Loader2, Check, X } from "lucide-react"

export function DashboardRow({ app }: { app: any }) {
  
  const statusColors: any = {
    'Pending': 'text-yellow-600 bg-yellow-50',
    'Shortlisted': 'text-blue-600 bg-blue-50',
    'Rejected': 'text-red-600 bg-red-50',
    'Selected': 'text-green-600 bg-green-50',
  }

  // ✅ Updated accessors for Prisma (camelCase)
  const candidateName = app.student?.profile?.fullName || "Unknown"
  const jobTitle = app.job?.title || "Unknown Job"
  const appliedDate = new Date(app.appliedAt).toLocaleDateString()

  return (
    <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
      
      {/* Candidate */}
      <td className="px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
            {candidateName.charAt(0)}
          </div>
          <span className="font-medium text-gray-900">{candidateName}</span>
        </div>
      </td>

      {/* Job Title */}
      <td className="px-8 py-4 text-gray-600">
        {jobTitle}
      </td>

      {/* Date */}
      <td className="px-8 py-4 text-gray-500">
        {appliedDate}
      </td>

      {/* Status */}
      <td className="px-8 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[app.status] || 'text-gray-600 bg-gray-100'}`}>
          {app.status}
        </span>
      </td>

      {/* Action (Link to View) */}
      <td className="px-8 py-4 text-right">
        <a href={`/admin/students?jobId=${app.jobId}`} className="text-sm font-medium text-black hover:underline">
          View Details
        </a>
      </td>
    </tr>
  )
}