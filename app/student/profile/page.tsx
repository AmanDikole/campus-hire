'use client'
import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase"
import { StudentSidebar } from "@/components/StudentSidebar"
import { 
  Save, Loader2, UploadCloud, FileText, UserCircle, 
  MapPin, Link as LinkIcon, Linkedin, Pencil, Plus, Trash2, 
  GraduationCap, Briefcase, FolderGit2, X
} from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // 1. Data States
  const [formData, setFormData] = useState<any>({
    full_name: '',
    branch: '',
    cgpa: '',
    skills: '',
    bio: '',
    linkedin_url: '',
    portfolio_url: '',
    resume_url: ''
  })
  
  const [education, setEducation] = useState<any[]>([])
  const [experience, setExperience] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])

  // 2. Fetch All Data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Main Profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) setFormData(profile)

      // Lists
      const { data: edu } = await supabase.from('profile_education').select('*').eq('student_id', user.id).order('year', { ascending: false })
      const { data: exp } = await supabase.from('profile_experience').select('*').eq('student_id', user.id)
      const { data: proj } = await supabase.from('profile_projects').select('*').eq('student_id', user.id)

      setEducation(edu || [])
      setExperience(exp || [])
      setProjects(proj || [])
    }
  }

  // 3. Handlers
  const handleSaveMain = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({ id: user.id, ...formData })
      setIsEditing(false)
    }
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    const file = e.target.files[0]
    const filePath = `${Math.random()}.${file.name.split('.').pop()}`
    
    const { error } = await supabase.storage.from('resumes').upload(filePath, file)
    if (error) {
      alert("Upload Error: " + error.message)
    } else {
      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(filePath)
      setFormData({ ...formData, resume_url: publicUrl })
    }
    setUploading(false)
  }

  // Generic List Handlers (Add/Delete/Update)
  const addItem = async (table: string, defaultData: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from(table).insert([{ student_id: user.id, ...defaultData }])
    if (!error) fetchData()
  }

  const deleteItem = async (table: string, id: string) => {
    if(!confirm("Delete this item?")) return
    await supabase.from(table).delete().eq('id', id)
    fetchData()
  }

  const updateItem = async (table: string, id: string, data: any) => {
    await supabase.from(table).update(data).eq('id', id)
    // We don't refill data here to avoid input lag, user must hit refresh or we assume success
  }

  const skillsArray = formData.skills ? formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <StudentSidebar />

      <main className="flex-1 lg:p-12 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* --- HEADER SECTION --- */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
            <div className="h-40 bg-gradient-to-r from-zinc-800 to-zinc-900"></div>
            
            <div className="px-8 pb-8">
              <div className="flex justify-between items-start">
                <div className="-mt-16 relative">
                   <div className="w-32 h-32 bg-white rounded-full p-2">
                      <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 border border-gray-200 overflow-hidden">
                        {formData.full_name ? formData.full_name.charAt(0) : <UserCircle size={64} />}
                      </div>
                   </div>
                </div>

                {/* Edit Toggle */}
                <div className="mt-4">
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-semibold hover:bg-gray-50 bg-white shadow-sm">
                      <Pencil size={14} /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                       <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-full">Cancel</button>
                       <button onClick={handleSaveMain} disabled={loading} className="px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 flex items-center gap-2">
                         {loading ? <Loader2 className="animate-spin" size={14}/> : "Save Changes"}
                       </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Headline */}
              <div className="mt-4 space-y-2">
                {isEditing ? (
                  <>
                    <input className="text-3xl font-bold w-full border-b border-gray-300 focus:border-black outline-none pb-1" value={formData.full_name || ''} onChange={(e) => setFormData({...formData, full_name: e.target.value})} placeholder="Your Name"/>
                    <input className="text-gray-600 w-full border-b border-gray-300 focus:border-black outline-none pb-1" value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Headline (e.g. CS Student)"/>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">{formData.full_name || "Your Name"}</h1>
                    <p className="text-lg text-gray-600">{formData.bio || "Add a headline..."}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                       <span className="flex items-center gap-1"><MapPin size={14}/> Pune, India</span>
                       <span className="text-gray-300">|</span>
                       <span className="text-blue-600 font-medium">{formData.email}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT COLUMN (2/3) --- */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* 1. EXPERIENCE */}
              <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Briefcase className="text-blue-600" size={20}/> Experience</h2>
                  {isEditing && (
                    <button onClick={() => addItem('profile_experience', { role: 'Role', company: 'Company' })} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={20}/></button>
                  )}
                </div>
                <div className="space-y-8">
                  {experience.map((item) => (
                    <div key={item.id} className="relative group pl-4 border-l-2 border-gray-100">
                      {isEditing && <button onClick={() => deleteItem('profile_experience', item.id)} className="absolute right-0 top-0 text-gray-400 hover:text-red-500"><X size={16}/></button>}
                      
                      {isEditing ? (
                        <div className="space-y-2">
                           <input className="font-bold w-full border-b focus:border-blue-500 outline-none" defaultValue={item.role} onBlur={(e) => updateItem('profile_experience', item.id, {role: e.target.value})} />
                           <input className="text-sm w-full border-b focus:border-blue-500 outline-none" defaultValue={item.company} onBlur={(e) => updateItem('profile_experience', item.id, {company: e.target.value})} />
                           <textarea className="text-sm w-full border rounded p-2 focus:border-blue-500 outline-none" defaultValue={item.description} onBlur={(e) => updateItem('profile_experience', item.id, {description: e.target.value})} placeholder="Description..."/>
                        </div>
                      ) : (
                        <div>
                           <h3 className="font-bold text-gray-900">{item.role}</h3>
                           <p className="text-sm text-gray-600">{item.company} • {item.duration || 'Date'}</p>
                           <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {experience.length === 0 && !isEditing && <p className="text-gray-400 italic">No experience added.</p>}
                </div>
              </section>

              {/* 2. PROJECTS */}
              <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2"><FolderGit2 className="text-purple-600" size={20}/> Projects</h2>
                  {isEditing && (
                    <button onClick={() => addItem('profile_projects', { title: 'Project Name' })} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={20}/></button>
                  )}
                </div>
                <div className="grid gap-4">
                  {projects.map((item) => (
                    <div key={item.id} className="p-5 border rounded-xl bg-gray-50/30 relative hover:border-gray-300 transition-colors">
                      {isEditing && <button onClick={() => deleteItem('profile_projects', item.id)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500"><X size={16}/></button>}
                      
                      {isEditing ? (
                        <div className="space-y-2">
                           <input className="font-bold w-full bg-transparent border-b focus:border-purple-500 outline-none" defaultValue={item.title} onBlur={(e) => updateItem('profile_projects', item.id, {title: e.target.value})} />
                           <input className="text-xs w-full bg-transparent border-b focus:border-purple-500 outline-none" defaultValue={item.link} placeholder="Link URL" onBlur={(e) => updateItem('profile_projects', item.id, {link: e.target.value})} />
                           <textarea className="text-sm w-full bg-transparent border rounded p-2 focus:border-purple-500 outline-none" defaultValue={item.description} onBlur={(e) => updateItem('profile_projects', item.id, {description: e.target.value})} placeholder="What did you build?"/>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                             <h3 className="font-bold text-gray-900">{item.title}</h3>
                             {item.link && <a href={item.link} target="_blank" className="text-blue-600 hover:bg-blue-50 p-1 rounded"><LinkIcon size={16}/></a>}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                  {projects.length === 0 && !isEditing && <p className="text-gray-400 italic">No projects added.</p>}
                </div>
              </section>

              {/* 3. SKILLS */}
              <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Skills</h2>
                {isEditing ? (
                  <>
                    <input className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100" value={formData.skills || ''} onChange={(e) => setFormData({...formData, skills: e.target.value})} placeholder="Java, React, SQL (comma separated)"/>
                    <p className="text-xs text-gray-500 mt-2">Separate tags with commas.</p>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.length > 0 ? skillsArray.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm border border-gray-200">{skill}</span>
                    )) : <p className="text-gray-400 italic">No skills listed.</p>}
                  </div>
                )}
              </section>

            </div>

            {/* --- RIGHT COLUMN (1/3) --- */}
            <div className="space-y-8">
              
              {/* 4. ACADEMICS */}
              <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><GraduationCap className="text-green-600" size={18}/> Academics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Branch</p>
                    {isEditing ? (
                      <select value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} className="w-full mt-1 p-2 border rounded bg-white">
                        <option value="">Select Branch</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                        <option value="MECH">Mechanical</option>
                      </select>
                    ) : <p className="font-medium text-lg">{formData.branch || "-"}</p>}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">CGPA</p>
                    {isEditing ? (
                      <input value={formData.cgpa} onChange={(e) => setFormData({...formData, cgpa: e.target.value})} className="w-full mt-1 p-2 border rounded" placeholder="0.0"/>
                    ) : <p className="font-medium text-lg">{formData.cgpa || "-"}</p>}
                  </div>
                </div>
              </section>

              {/* 5. EDUCATION LIST */}
              <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">Education History</h3>
                  {isEditing && <button onClick={() => addItem('profile_education', { degree: 'Degree', school: 'School' })} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={16}/></button>}
                </div>
                <div className="space-y-5">
                   {education.map((item) => (
                     <div key={item.id} className="relative group">
                       {isEditing && <button onClick={() => deleteItem('profile_education', item.id)} className="absolute right-0 top-0 text-gray-400 hover:text-red-500"><X size={14}/></button>}
                       
                       {isEditing ? (
                         <div className="space-y-1">
                            <input className="font-bold w-full text-sm border-b" defaultValue={item.degree} onBlur={(e) => updateItem('profile_education', item.id, {degree: e.target.value})} />
                            <input className="text-xs w-full border-b" defaultValue={item.school} onBlur={(e) => updateItem('profile_education', item.id, {school: e.target.value})} />
                            <input className="text-xs w-full border-b" defaultValue={item.year} placeholder="Year" onBlur={(e) => updateItem('profile_education', item.id, {year: e.target.value})} />
                         </div>
                       ) : (
                         <>
                           <h4 className="font-bold text-sm text-gray-900">{item.degree}</h4>
                           <p className="text-xs text-gray-600">{item.school}</p>
                           <p className="text-xs text-gray-400 mt-0.5">{item.year} {item.score ? `• ${item.score}` : ''}</p>
                         </>
                       )}
                     </div>
                  ))}
                </div>
              </section>

              {/* 6. LINKS & RESUME */}
              <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                
                {/* Links */}
                <div>
                   <h3 className="font-bold text-gray-900 mb-3">On the web</h3>
                   <div className="space-y-3">
                      {isEditing ? (
                         <input className="w-full text-sm border rounded p-2" value={formData.linkedin_url || ''} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} placeholder="LinkedIn URL"/>
                      ) : formData.linkedin_url && (
                        <a href={formData.linkedin_url} target="_blank" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 hover:underline"><Linkedin size={16}/> LinkedIn</a>
                      )}

                      {isEditing ? (
                         <input className="w-full text-sm border rounded p-2 mt-2" value={formData.portfolio_url || ''} onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})} placeholder="Portfolio URL"/>
                      ) : formData.portfolio_url && (
                        <a href={formData.portfolio_url} target="_blank" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 hover:underline"><LinkIcon size={16}/> Portfolio</a>
                      )}
                   </div>
                </div>

                {/* Resume Upload */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3">Resume</h3>
                  {formData.resume_url ? (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-blue-600"/>
                        <span className="text-xs font-medium text-blue-900">Uploaded</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <a href={formData.resume_url} target="_blank" className="text-blue-700 font-medium hover:underline">View</a>
                        {isEditing && <button onClick={() => setFormData({...formData, resume_url: ''})} className="text-red-500 hover:underline">Remove</button>}
                      </div>
                    </div>
                  ) : (
                    <label className={`block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${!isEditing ? 'pointer-events-none opacity-60' : ''}`}>
                       <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={!isEditing || uploading} />
                       <div className="flex flex-col items-center gap-1 text-gray-400">
                          {uploading ? <Loader2 className="animate-spin" /> : <UploadCloud size={20}/>}
                          <span className="text-xs font-medium">{isEditing ? "Upload PDF" : "Empty"}</span>
                       </div>
                    </label>
                  )}
                </div>

              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}