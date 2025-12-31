'use client'
import { Download } from "lucide-react"

export function ExportButton({ data }: { data: any[] }) {
  
  const handleExport = () => {
    if (!data || data.length === 0) return alert("No data to export")

    // 1. Flatten the data for Excel (Handle nested objects)
    const csvRows = []
    
    // Headers
    const headers = ["Student Name", "Email", "Branch", "CGPA", "Job Title", "Company", "Status", "Applied Date"]
    csvRows.push(headers.join(','))

    // Rows
    data.forEach(row => {
      const profile = row.profiles || {}
      const job = row.jobs || {}
      
      const values = [
        `"${profile.full_name || 'N/A'}"`,     // Quotes handle names with commas
        `"${row.student_email}"`,
        `"${profile.branch || 'N/A'}"`,
        `"${profile.cgpa || 'N/A'}"`,
        `"${job.title || 'N/A'}"`,
        `"${job.company || 'N/A'}"`,
        `"${row.status}"`,
        `"${new Date(row.created_at).toLocaleDateString()}"`
      ]
      csvRows.push(values.join(','))
    })

    // 2. Create File Blob
    const csvString = csvRows.join('\n')
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    
    // 3. Trigger Download
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `placement_report_${new Date().toISOString().split('T')[0]}.csv`)
    a.click()
  }

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm"
    >
      <Download size={16} /> Export CSV
    </button>
  )
}