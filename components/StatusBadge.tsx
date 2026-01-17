'use client'

import { updateApplicationStatus } from "@/actions/update-application-status"
import { toast } from "sonner"

export function StatusToggle({ applicationId, currentStatus }: { applicationId: string, currentStatus: string }) {
  const handleStatusChange = async (newStatus: string) => {
    const res = await updateApplicationStatus(applicationId, newStatus)
    if (res.success) {
      toast.success(res.success)
    } else {
      toast.error(res.error)
    }
  }

  return (
    <select 
      defaultValue={currentStatus} 
      onChange={(e) => handleStatusChange(e.target.value)}
      className="text-xs font-bold border rounded-lg p-1"
    >
      <option value="Pending">Pending</option>
      <option value="Shortlisted">Shortlisted</option>
      <option value="Rejected">Rejected</option>
      <option value="Selected">Selected</option>
    </select>
  )
}