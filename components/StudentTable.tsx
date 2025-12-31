'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { ApplicationRow } from "@/components/ApplicationRow"

export function StudentTable({ initialApplications }: { initialApplications: any[] }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // 1. Subscribe to the 'applications' table
    const channel = supabase
      .channel('realtime-applications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        (payload) => {
          // 2. When ANY change happens (Insert, Update, Delete)...
          console.log('Real-time update detected:', payload)
          
          // 3. ...Refresh the data from the server
          // This re-runs the Server Component and passes down fresh props
          router.refresh() 
        }
      )
      .subscribe()

    // Cleanup when component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
          <tr>
            <th className="px-6 py-4">Candidate</th>
            <th className="px-6 py-4">Academics</th>
            <th className="px-6 py-4">Role Applied</th>
            <th className="px-6 py-4">Resume</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {initialApplications?.map((app: any) => (
            <ApplicationRow key={app.id} app={app} />
          ))}
        </tbody>
      </table>
      
      {(!initialApplications || initialApplications.length === 0) && (
        <div className="p-12 text-center text-gray-500">
          No applications found matching your filters.
        </div>
      )}
    </div>
  )
}