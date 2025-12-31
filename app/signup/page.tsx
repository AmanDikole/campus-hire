'use client'
import { useState } from 'react'
import { createClient } from "@/lib/supabase"
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, GraduationCap, Building2 } from 'lucide-react'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'student' | 'admin'>('student')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { role } } // Role is saved here
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Account created! Logging you in...")
      // Redirect based on role
      const target = role === 'admin' ? '/admin/dashboard' : '/'
      router.push(target)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-full bg-white">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="z-10 text-center space-y-6 max-w-lg p-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-6xl font-bold text-white tracking-tight"
          >
            Join the <br/> <span className="text-blue-200">Network.</span>
          </motion.h1>
          <p className="text-blue-100 text-lg">Create an account to start applying or hiring top talent today.</p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-500">Get started with your placement journey.</p>
          </div>

          {/* ROLE TOGGLE */}
          <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
            <button 
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${role === 'student' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <GraduationCap size={18} /> Student
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${role === 'admin' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Building2 size={18} /> Admin
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:ring-0 transition-all outline-none border"
                placeholder={role === 'student' ? "student@college.edu" : "admin@college.edu"}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:ring-0 transition-all outline-none border"
                placeholder="Create a strong password"
              />
            </div>
          </div>

          <button 
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}