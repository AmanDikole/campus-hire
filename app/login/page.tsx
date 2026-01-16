'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Building2, Loader2, Lock, Mail } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Invalid email or password")
      setLoading(false)
    } else {
      toast.success("Welcome back!")
      // ⚡ FIX: Force a hard reload to the home page. 
      // The Middleware will then decide whether to send you to /student or /admin
      window.location.href = "/" 
    }
  }

  // ... rest of the JSX stays exactly the same ...
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl shadow-gray-200 border border-white">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-300">
            <Building2 size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your credentials to access the portal.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input name="email" type="email" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-gray-300 outline-none transition-all" placeholder="student@college.edu" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input name="password" type="password" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-gray-300 outline-none transition-all" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 mt-2">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link href="/signup" className="font-bold text-black hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  )
}