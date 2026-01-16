'use client'

import { useRouter, useSearchParams } from "next/navigation"

export function AdminFilterBar({ jobs }: { jobs: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      
      {/* Filter by Job */}
      <select 
        onChange={(e) => handleFilter('jobId', e.target.value)}
        defaultValue={searchParams.get('jobId') || ''}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="">All Jobs</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>{job.title}</option>
        ))}
      </select>

      {/* Filter by Status */}
      <select 
        onChange={(e) => handleFilter('status', e.target.value)}
        defaultValue={searchParams.get('status') || ''}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Shortlisted">Shortlisted</option>
        <option value="Rejected">Rejected</option>
        <option value="Selected">Selected</option>
      </select>

      {/* Clear Filters Button */}
      {(searchParams.get('jobId') || searchParams.get('status')) && (
        <button 
          onClick={() => router.push('?')}
          className="text-sm text-red-600 hover:text-red-800 font-medium px-2"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}