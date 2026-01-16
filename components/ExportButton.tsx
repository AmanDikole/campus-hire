'use client'

import { Download } from "lucide-react"

export function ExportButton({ data }: { data: any[] }) {
  
  const handleExport = () => {
    if (!data || data.length === 0) return alert("No data to export")

    // 1. Define CSV Headers
    const headers = ["Candidate Name", "Email", "Job Title", "Company", "Branch", "CGPA", "Status", "Applied Date"]
    
    // 2. Map Data to Rows
    const rows = data.map(app => [
      app.profiles?.full_name || "Unknown",
      app.student_email,
      app.jobs?.title,
      app.jobs?.company,
      app.profiles?.branch,
      app.profiles?.cgpa,
      app.status,
      new Date(app.created_at).toLocaleDateString()
    ])

    // 3. Convert to CSV String
    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.join(","))
    ].join("\n")

    // 4. Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `applications_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
  }

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      <Download size={16} />
      Export CSV
    </button>
  )
}