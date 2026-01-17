'use client'

import { exportApplicationsAction } from "@/actions/export-applications"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function ExportButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const result = await exportApplicationsAction(jobId)
      
      if (result.error) {
        toast.error(result.error)
        return
      }

      // Create a blob and trigger download
      const blob = new Blob([result.csvContent!], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.fileName!
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success("List exported successfully!")
    } catch (err) {
      toast.error("Export failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-100"
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
      Export Applicants (.CSV)
    </button>
  )
}