'use client'

import { updateProfileAction } from "@/actions/update-profile"
import {
    User, GraduationCap, Link as LinkIcon, Save, Loader2, FileText,
    Trash2, ExternalLink, ShieldCheck, AlertTriangle, Hash, Calendar,
    Briefcase, Activity, UserCheck
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { UploadDropzone } from "@uploadthing/react"
import { OurFileRouter } from "@/app/api/uploadthing/core"

export function ProfileForm({ profile }: { profile: any }) {
    const [loading, setLoading] = useState(false)
    const [resumeUrl, setResumeUrl] = useState(profile.resumeUrl || "")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await updateProfileAction(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.success)
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">

            {/* 1. VERIFICATION STATUS HEADER */}
            {profile.isVerified ? (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl flex items-center gap-4 text-emerald-800 shadow-sm shadow-emerald-100">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                        <ShieldCheck size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-lg leading-tight">Verified Profile</p>
                        <p className="text-sm opacity-90">Your data has been approved by the College Admin. Updates will reset verification.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex items-center gap-4 text-amber-800 shadow-sm shadow-amber-100">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-amber-200">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-lg leading-tight">Verification Pending</p>
                        <p className="text-sm opacity-90">Please ensure all marks are correct. An Admin will verify your records soon.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 2. OFFICIAL IDENTITY */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="font-bold flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900">
                        <UserCheck className="text-blue-500" size={20} /> Identity & PRN
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">PRN Number (University ID)</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    name="prnNumber"
                                    defaultValue={profile.prnNumber}
                                    required
                                    placeholder="Enter Official PRN"
                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                            <input name="fullName" defaultValue={profile.fullName} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Branch</label>
                                <select name="branch" defaultValue={profile.branch || ""} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none">
                                    <option value="CSE">CSE</option>
                                    <option value="IT">IT</option>
                                    <option value="ECE">ECE</option>
                                    <option value="MECH">MECH</option>
                                    <option value="CIVIL">CIVIL</option>
                                    <option value="AI&DS">AI & DS</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Gender</label>
                                <select name="gender" defaultValue={profile.gender || ""} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. ACADEMIC MARKS */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="font-bold flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900">
                        <GraduationCap className="text-purple-500" size={20} /> Academic Scores
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Current CGPA</label>
                            <input name="cgpa" type="number" step="0.01" min="0" max="10" defaultValue={profile.cgpa} required className="w-full p-3 border border-gray-200 rounded-xl outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Passout Year</label>
                            <input name="passoutYear" type="number" placeholder="2025" defaultValue={profile.passoutYear} required className="w-full p-3 border border-gray-200 rounded-xl outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">10th %</label>
                            <input name="percent10th" type="number" step="0.01" min="0" max="100" defaultValue={profile.percent10th} className="w-full p-3 border border-gray-200 rounded-xl outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">12th / Diploma %</label>
                            <input name="percent12th" type="number" step="0.01" min="0" max="100" defaultValue={profile.percent12th} className="w-full p-3 border border-gray-200 rounded-xl outline-none" />
                        </div>
                    </div>
                </div>

                {/* 4. BACKLOGS & GAPS */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="font-bold flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900">
                        <Activity className="text-red-500" size={20} /> Consistency Tracking
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-red-600">Live Backlogs</label>
                            <input name="liveBacklogs" type="number" min="0" defaultValue={profile.liveBacklogs || 0} className="w-full p-3 bg-red-50/30 border border-red-100 rounded-xl outline-none focus:border-red-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600">Dead Backlogs</label>
                            <input name="deadBacklogs" type="number" min="0" defaultValue={profile.deadBacklogs || 0} className="w-full p-3 border border-gray-200 rounded-xl outline-none" />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs font-bold text-gray-600">Gap Years (Education Gap)</label>
                            <div className="flex gap-2">
                                <input name="gapYears" type="number" min="0" defaultValue={profile.gapYears || 0} className="w-24 p-3 border border-gray-200 rounded-xl outline-none" />
                                <input name="gapReason" placeholder="Reason for gap (if any)" defaultValue={profile.gapReason || ""} className="flex-1 p-3 border border-gray-200 rounded-xl outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. PROFESSIONAL LINKS */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="font-bold flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900">
                        <Briefcase className="text-emerald-500" size={20} /> Career Profile
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Resume (PDF Only)</label>
                            {resumeUrl ? (
                                <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl group transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200"><FileText size={20} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-emerald-900">Resume_Verified.pdf</p>
                                            <a href={resumeUrl} target="_blank" className="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:underline">Preview <ExternalLink size={10} /></a>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setResumeUrl("")} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"><Trash2 size={20} /></button>
                                </div>
                            ) : (
                                <UploadDropzone<OurFileRouter, "resumeUploader">
                                    endpoint="resumeUploader"
                                    onClientUploadComplete={(res) => { setResumeUrl(res[0].url); toast.success("Resume uploaded!"); }}
                                    // ✅ Correct: Returns void
                                    onUploadError={(error: Error) => {
                                        toast.error(error.message);
                                    }}
                                    appearance={{
                                        container: "border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl py-6 hover:bg-gray-50 transition-all cursor-pointer",
                                        button: "bg-black text-white px-6 py-2 rounded-lg text-xs font-bold"
                                    }}
                                />
                            )}
                            <input type="hidden" name="resumeUrl" value={resumeUrl} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">GitHub URL</label>
                            <input name="githubUrl" type="url" defaultValue={profile.githubUrl || ""} placeholder="https://github.com/..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-center md:justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-black text-white px-12 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} className="group-hover:translate-y-[-2px] transition-transform" />}
                    Update Profile & Request Verification
                </button>
            </div>

        </form>
    )
}