'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react" // ✅ NextAuth
import { getUserSession } from "@/actions/get-user" // ✅ Our new helper
import { LayoutDashboard, Briefcase, Users, TrendingUp, Building2, Settings, LogOut, Loader2 } from "lucide-react"
import { MobileNav } from "@/components/MobileNav"

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Post New Job", href: "/admin/post-job", icon: Briefcase },
  { name: "Manage Jobs", href: "/admin/jobs", icon: Settings },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [email, setEmail] = useState<string>("Loading...")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // ✅ Fetch User via Server Action
  useEffect(() => {
    async function getUser() {
      const user = await getUserSession()
      if (user?.email) setEmail(user.email)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: '/login' }) // ✅ NextAuth Logout
  }

  // ... keep the return statement exactly the same ...
  // (Paste the rest of your AdminSidebar JSX here)
  return (
    <>
      <MobileNav menuItems={menuItems} role="admin" userEmail={email} />
      <aside className="hidden lg:flex w-72 bg-[#09090b] text-white flex-col border-r border-gray-800 sticky top-0 h-screen">
        {/* ... (Copy the JSX content from your previous file) ... */}
        {/* If you need the full JSX again, refer to the previous message or ask me to reprint it! */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2 mt-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-none">CampusHire</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Admin Portal</span>
            </div>
          </div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = item.href === '/admin/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive ? "bg-white/10 text-white shadow-sm border border-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"></div>}
                  <item.icon size={18} className={`transition-colors ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`} /> 
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-gray-800 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-gray-700 flex items-center justify-center text-xs font-bold shadow-lg">AD</div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Placement Officer</p>
              <p className="text-xs text-gray-500 truncate" title={email}>{email}</p>
            </div>
          </div>
          <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-900/30">
            {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  )
}