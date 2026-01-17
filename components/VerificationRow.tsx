'use client'

import { verifyStudentAction } from "@/actions/verify-student"
import { CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

export function VerificationRow({ profile }: any) {
  const handleVerify = async () => {
    const res = await verifyStudentAction(profile.id, true)
    if (res.success) toast.success("Student Verified Successfully")
  }

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-8 py-5">
        <p className="font-bold text-gray-900">{profile.fullName}</p>
        <p className="text-xs text-gray-400 font-mono mt-0.5">{profile.prnNumber}</p>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
            {profile.cgpa} CGPA
          </span>
          <span className="text-xs bg-gray-50 text-gray-600 font-bold px-2 py-0.5 rounded">
            {profile.liveBacklogs} Backlogs
          </span>
        </div>
      </td>
      <td className="px-8 py-5 text-sm font-medium text-gray-600">
        {profile.branch}
      </td>
      <td className="px-8 py-5 text-right">
        <button 
          onClick={handleVerify}
          className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 ml-auto shadow-lg shadow-emerald-100"
        >
          <CheckCircle size={14} /> Approve
        </button>
      </td>
    </tr>
  )
}