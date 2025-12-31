'use client'
import { motion } from "framer-motion"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { MapPin, Lock, CheckCircle2, Ban } from "lucide-react"

export function JobCard({ job, userProfile, hasApplied }: { job: any, userProfile: any, hasApplied: boolean }) {
  
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(hasApplied)

  // 1. Check if Drive is Closed (Admin Control)
  // If is_active is missing/null, assume it's active (true) to be safe
  const isClosed = job.is_active === false

  // 2. Check Eligibility (CGPA & Branch)
  const studentCgpa = parseFloat(userProfile?.cgpa || '0')
  const requiredCgpa = job.min_cgpa || 0
  const isCgpaEligible = studentCgpa >= requiredCgpa
  const requiredBranches = job.eligible_branches || []
  const isBranchEligible = requiredBranches.length === 0 || requiredBranches.includes(userProfile?.branch)

  const isEligible = isCgpaEligible && isBranchEligible

  let eligibilityError = ""
  if (!isCgpaEligible) eligibilityError = `Requires ${requiredCgpa} CGPA`
  else if (!isBranchEligible) eligibilityError = `Open for ${requiredBranches.join(', ')} only`

  const handleApply = async () => {
    if (isClosed || !isEligible || applied) return
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase.from('applications').insert([{ 
        job_id: job.id, 
        student_email: user.email, 
        student_id: user.id,
        student_name: userProfile?.full_name || user.email?.split('@')[0] || "Unknown"
      }])
      
      if (!error) {
        setApplied(true)
      } else {
        // Handle "Unique Constraint" error gracefully
        if (error.code === '23505') setApplied(true)
        else alert("Error: " + error.message)
      }
    }
    setLoading(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border transition-all relative overflow-hidden ${
        isClosed 
          ? "bg-gray-100 border-gray-200 opacity-60 grayscale" // Grey out if Closed
          : isEligible 
            ? "bg-white border-gray-100 hover:shadow-lg" 
            : "bg-gray-50 border-gray-200 opacity-75"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
             {job.salary}
           </span>
           {isClosed && (
             <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 border border-red-200 px-2 py-0.5 rounded bg-red-50">
               Closed
             </span>
           )}
        </div>
      </div>
      
      {/* Criteria Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {job.min_cgpa > 0 && (
          <span className={`text-xs px-2 py-1 rounded border ${isCgpaEligible ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            Min CGPA: {job.min_cgpa}
          </span>
        )}
        {job.eligible_branches?.length > 0 && (
          <span className={`text-xs px-2 py-1 rounded border ${isBranchEligible ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {job.eligible_branches.join('/')}
          </span>
        )}
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <span className="text-gray-400 text-xs flex items-center gap-1">
           <MapPin size={12} /> {job.location}
        </span>
        
        {/* --- SMART BUTTON LOGIC --- */}
        {(() => {
          // 1. If Job is Closed by Admin
          if (isClosed) {
            return (
              <button disabled className="px-5 py-2 rounded-xl text-sm font-semibold bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300 flex items-center gap-2">
                <Ban size={16} /> Applications Closed
              </button>
            )
          }

          // 2. If Not Eligible
          if (!isEligible) {
            return (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100 cursor-not-allowed">
                <Lock size={14} /> <span className="text-xs font-bold">{eligibilityError}</span>
              </div>
            )
          }

          // 3. If Eligible (Show Apply or Applied)
          return (
            <button 
              onClick={handleApply}
              disabled={loading || applied}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                applied 
                  ? "bg-green-50 text-green-700 border border-green-200 cursor-default" 
                  : "bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? "Applying..." : applied ? <><CheckCircle2 size={16}/> Applied</> : "Apply Now"}
            </button>
          )
        })()}
        
      </div>
    </motion.div>
  )
}