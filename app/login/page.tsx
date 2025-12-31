'use client'
import { useState } from 'react'
import { createClient } from "@/lib/supabase"
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert(error.message)
    } else {
      // In a real app, you might check the user's role here to redirect correctly
      router.push('/') 
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-full bg-white">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="z-10 text-center space-y-6 max-w-lg p-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-6xl font-bold text-white tracking-tight"
          >
            Welcome <br/> <span className="text-blue-500">Back.</span>
          </motion.h1>
          <p className="text-zinc-400 text-lg">Continue your journey to your dream career.</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-gray-500">Enter your credentials to access your account.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:ring-0 transition-all outline-none border"
                placeholder="student@college.edu"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:ring-0 transition-all outline-none border"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-zinc-950 text-white py-3.5 rounded-xl font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}