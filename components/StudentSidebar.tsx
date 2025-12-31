'use client'
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { 
  LayoutGrid, FileText, Bell, UserCircle, LogOut, Building2 
} from "lucide-react"
import { MobileNav } from "@/components/MobileNav" // ✅ Import

// Define menu items once so we can pass them to both Desktop and Mobile
const menuItems = [
  { name: "Find Jobs", href: "/student", icon: LayoutGrid },
  { name: "My Applications", href: "/student/applications", icon: FileText },
  { name: "Notifications", href: "/student/notifications", icon: Bell },
  { name: "My Profile", href: "/student/profile", icon: UserCircle },
]

export function StudentSidebar() {
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
      {/* ✅ 1. MOBILE NAV (Hidden on LG screens) */}
      <MobileNav menuItems={menuItems} role="student" />

      {/* ✅ 2. DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex-col justify-between">
        
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="bg-black p-1.5 rounded-lg">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">CampusHire</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-black text-white shadow-lg shadow-gray-200" 
                      : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}