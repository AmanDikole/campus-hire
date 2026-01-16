'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react" // ✅ NextAuth
import { getUserSession } from "@/actions/get-user" // ✅ Helper
import { LayoutDashboard, Briefcase, User, Bell, LogOut, Loader2, Building2 } from "lucide-react"
import { MobileNav } from "@/components/MobileNav"

const menuItems = [
  { label: "Jobs Feed", icon: LayoutDashboard, href: "/student" },
  { label: "My Applications", icon: Briefcase, href: "/student/applications" },
  { label: "Notifications", icon: Bell, href: "/student/notifications" },
  { label: "My Profile", icon: User, href: "/student/profile" },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const [email, setEmail] = useState<string>("Loading...")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // ✅ Fetch User
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

  const mobileItems = menuItems.map(i => ({ name: i.label, href: i.href, icon: i.icon }))

  return (
    <>
      <MobileNav menuItems={mobileItems} role="student" userEmail={email} />
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen z-40">
        {/* ... (Paste the rest of your StudentSidebar JSX here, identical to before) ... */}
        {/* If you need it reprinted, let me know! */}
         <div className="p-8 pb-4">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="bg-black text-white p-2 rounded-xl"><Building2 size={20} /></div>
            <div>
                <span className="font-bold text-xl tracking-tight text-gray-900 block leading-none">CampusHire</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Student Portal</span>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Main Menu</p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${isActive ? "bg-black text-white shadow-lg shadow-gray-200" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
                  <item.icon size={18} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} />
                  {item.label}
                  {isActive && <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-gray-100 bg-gray-50/50">
           <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">ST</div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-gray-900 truncate">Student Account</p>
               <p className="text-xs text-gray-500 truncate" title={email}>{email}</p>
             </div>
           </div>
           <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all border border-transparent hover:border-red-100">
            {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  )
}