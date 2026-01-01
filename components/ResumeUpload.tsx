'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase" // Client-side client
import { FileText, Upload, Check, Loader2, X } from "lucide-react"

export function ResumeUpload({ currentUrl, onUploadComplete }: { currentUrl?: string, onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [fileUrl, setFileUrl] = useState(currentUrl)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Validation
    if (file.type !== 'application/pdf') {
      return setError("Only PDF files are allowed.")
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB Limit
      return setError("File size must be less than 2MB.")
    }

    setError("")
    setUploading(true)

    try {
      // 2. Unique File Name: studentID_timestamp.pdf
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not found")

      const fileName = `${user.id}_${Date.now()}.pdf`

      // 3. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 4. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      setFileUrl(publicUrl)
      onUploadComplete(publicUrl) // Pass URL back to parent form

    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-700 block">Resume (PDF)</label>
      
      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
        <input 
          type="file" 
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center text-gray-500">
            <Loader2 className="animate-spin mb-2" />
            <span className="text-xs">Uploading...</span>
          </div>
        ) : fileUrl ? (
          <div className="flex flex-col items-center text-green-600">
            <Check className="mb-2 bg-green-100 p-1 rounded-full" size={24} />
            <span className="text-sm font-medium">Resume Uploaded</span>
            <a href={fileUrl} target="_blank" className="text-xs underline mt-1 text-gray-400 hover:text-black z-10 relative">View Current File</a>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <Upload className="mb-2" size={24} />
            <span className="text-sm">Click to upload PDF</span>
            <span className="text-xs text-gray-400 mt-1">Max 2MB</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X size={12} /> {error}
        </p>
      )}
    </div>
  )
}
