'use client'
import Link from 'next/link'
import { createClient } from "@/lib/supabase"
import { useRouter } from 'next/navigation'
import { User, LogOut } from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
          🎓 <span className="hidden sm:inline">CampusHire</span>
        </Link>
        <div className="h-6 w-px bg-gray-200"></div>
        <div className="flex gap-4 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-black transition">Find Jobs</Link>
          <Link href="/student/profile" className="hover:text-black transition">My Profile</Link>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
      >
        <LogOut size={16} /> Logout
      </button>
    </nav>
  )
}