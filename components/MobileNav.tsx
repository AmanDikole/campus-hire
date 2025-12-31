'use client'
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
// ✅ FIX: Import 'Variants' type here
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Menu, X, LogOut, Building2 } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface MenuItem {
  name: string
  href: string
  icon: any
}

export function MobileNav({ menuItems, role }: { menuItems: MenuItem[], role: 'student' | 'admin' }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // ✅ FIX: Explicitly type this object as 'Variants'
  const menuVariants: Variants = {
    closed: { 
      x: "-100%", 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    open: { 
      x: 0, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    }
  }

  return (
    <div className="lg:hidden">
      {/* 1. TOP BAR (Visible on Mobile) */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-black p-1.5 rounded-lg">
            <Building2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">CampusHire</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>

      {/* 2. OVERLAY & DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            
            {/* Slide-out Menu */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Header inside Drawer */}
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <span className="font-bold text-xl">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                   const isActive = pathname === item.href
                   return (
                     <Link 
                       key={item.href} 
                       href={item.href}
                       onClick={() => setIsOpen(false)} // Close menu on click
                       className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
                         isActive 
                           ? "bg-black text-white shadow-lg shadow-gray-200" 
                           : "text-gray-600 hover:bg-gray-50"
                       }`}
                     >
                       <item.icon size={20} />
                       {item.name}
                     </Link>
                   )
                })}
              </nav>

              {/* Footer / Logout */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 capitalize">{role} Account</p>
                      <p className="text-xs text-gray-500">Logged In</p>
                    </div>
                 </div>
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
                 >
                   <LogOut size={18} /> Sign Out
                 </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}