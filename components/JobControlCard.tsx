'use client'

import { toggleJobStatus } from "@/actions/toggle-job-status"
import { Calendar, MapPin, Users, Power, Eye, Briefcase } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useTransition } from "react"

export function JobControlCard({ job, applicantCount }: { job: any, applicantCount: number }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      // ✅ Pass job.id and job.isActive (camelCase)
      const result = await toggleJobStatus(job.id, job.isActive)
      if (result.success) {
        toast.success(job.isActive ? "Drive Closed" : "Drive Activated")
      } else {
        toast.error("Failed to update status")
      }
    })
  }

  return (
    <div className={`group bg-white p-6 rounded-3xl border transition-all ${job.isActive ? 'border-gray-200 shadow-sm hover:shadow-md' : 'border-gray-100 opacity-75'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-lg font-bold text-gray-900 border border-gray-100">
             {job.company.charAt(0)}
           </div>
           <div>
             <h3 className="font-bold text-gray-900 leading-tight">{job.title}</h3>
             <p className="text-sm text-gray-500 font-medium">{job.company}</p>
           </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${job.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
          {job.isActive ? 'Active' : 'Closed'}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 bg-gray-50/50 p-3 rounded-xl">
        <div className="flex items-center gap-1.5">
           <Users size={16} className="text-blue-500" />
           <span className="font-bold text-gray-700">{applicantCount}</span> <span className="text-xs">Applicants</span>
        </div>
        <div className="w-px h-4 bg-gray-300"></div>
        <div className="flex items-center gap-1.5">
           <Calendar size={16} />
           <span className="text-xs">{new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
         <Link href={`/admin/students?jobId=${job.id}`} className="flex-1 bg-black text-white h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition">
            <Eye size={16} /> View Applicants
         </Link>
         
         <button 
           onClick={handleToggle}
           disabled={isPending}
           className={`h-10 px-4 rounded-xl font-bold text-sm border flex items-center gap-2 transition-colors ${
             job.isActive 
              ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' 
              : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
           }`}
         >
           <Power size={16} />
           {job.isActive ? 'Close' : 'Open'}
         </button>
      </div>

    </div>
  )
}