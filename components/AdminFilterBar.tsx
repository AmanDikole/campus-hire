'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X } from "lucide-react"

export function AdminFilterBar({ jobs }: { jobs: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentJob = searchParams.get('jobId') || ''
  const currentStatus = searchParams.get('status') || ''

  // Update URL when filter changes
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/students?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/admin/students')
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mr-2">
        <Filter size={16} /> Filters:
      </div>

      {/* 1. Job Selector */}
      <select 
        value={currentJob}
        onChange={(e) => handleFilterChange('jobId', e.target.value)}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-black bg-gray-50 min-w-[200px]"
      >
        <option value="">All Jobs</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.company} - {job.title}
          </option>
        ))}
      </select>

      {/* 2. Status Selector */}
      <select 
        value={currentStatus}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-black bg-gray-50"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Shortlisted">Shortlisted</option>
        <option value="Selected">Selected</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* 3. Clear Button */}
      {(currentJob || currentStatus) && (
        <button 
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs text-red-600 font-medium hover:bg-red-50 px-3 py-2 rounded-lg ml-auto"
        >
          <X size={14} /> Clear
        </button>
      )}
    </div>
  )
}