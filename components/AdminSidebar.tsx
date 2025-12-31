'use client'
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { 
  LayoutDashboard, Briefcase, Users, TrendingUp, Building2, Settings, LogOut
} from "lucide-react"
import { MobileNav } from "@/components/MobileNav" // ✅ Import

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Post New Job", href: "/admin/post-job", icon: Briefcase },
  { name: "Manage Jobs", href: "/admin/jobs", icon: Settings },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* ✅ 1. MOBILE NAV */}
      <MobileNav menuItems={menuItems} role="admin" />

      {/* ✅ 2. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-[#09090b] text-white flex-col border-r border-gray-800 sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              CampusHire <span className="text-gray-500 font-normal">Admin</span>
            </span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? "bg-white/10 text-white shadow-sm border border-white/5" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"} /> 
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 border border-gray-700"></div>
            <div>
              <p className="text-sm font-medium text-white">Placement Officer</p>
              <p className="text-xs text-gray-500">admin@college.edu</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}