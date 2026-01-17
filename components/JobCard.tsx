'use client'

import { applyForJob } from "@/actions/apply-job"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Banknote, AlertCircle, CheckCircle, ShieldAlert, ChevronRight, Briefcase } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function JobCard({ job, userProfile, hasApplied }: any) {
  const [applied, setApplied] = useState(hasApplied)

  const checkIneligibility = () => {
    if (!userProfile.isVerified) return "Verification pending by TPO." //
    if (userProfile.cgpa < job.minCgpa) return `Required CGPA: ${job.minCgpa}`
    if (userProfile.liveBacklogs > job.maxLiveBacklogs) return `Backlog Limit: ${job.maxLiveBacklogs}`
    if (job.eligibleBranches.length > 0 && !job.eligibleBranches.includes(userProfile.branch)) {
      return "Branch not eligible."
    }
    return null
  }

  const reason = checkIneligibility()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden"
    >
      {/* Visual Identity Strip */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${applied ? 'bg-emerald-500' : reason ? 'bg-red-500' : 'bg-blue-600'}`} />

      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:bg-blue-600 transition-colors duration-300">
             <Briefcase size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">{job.title}</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{job.company}</p>
          </div>
        </div>
      </div>

      {/* Core Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl">
          <MapPin size={16} className="text-blue-500" />
          <span className="text-xs font-bold text-gray-600">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 p-3 rounded-2xl">
          <Banknote size={16} className="text-emerald-600" />
          <span className="text-xs font-black text-emerald-700">{job.salary}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {applied ? (
            <motion.div 
              key="applied"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-emerald-100"
            >
              <CheckCircle size={16} /> Application Sent
            </motion.div>
          ) : reason ? (
            <motion.div key="locked" className="space-y-3">
              <button disabled className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <ShieldAlert size={16} /> Drive Locked
              </button>
              <div className="flex items-center justify-center gap-1.5 py-1 px-3 bg-red-50 rounded-full w-fit mx-auto">
                <AlertCircle size={12} className="text-red-500" />
                <p className="text-[10px] text-red-500 font-black uppercase tracking-wider">{reason}</p>
              </div>
            </motion.div>
          ) : (
            <motion.button 
              key="apply"
              whileTap={{ scale: 0.97 }}
              onClick={async () => {
                const res = await applyForJob(job.id)
                if (res.success) { setApplied(true); toast.success(res.success); }
              }}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 group/btn"
            >
              Apply Now <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}