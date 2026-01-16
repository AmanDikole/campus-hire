'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Menu, X, LogOut, Building2, ChevronRight, UserCircle } from "lucide-react"
import { signOut } from "next-auth/react" // ✅ Use NextAuth
import { LucideIcon } from "lucide-react"

// ... keep interfaces ...
interface MenuItem {
  name: string
  href: string
  icon: LucideIcon
}

interface MobileNavProps {
  menuItems: MenuItem[]
  role: 'student' | 'admin'
  userEmail?: string 
}

export function MobileNav({ menuItems, role, userEmail }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  // const router = useRouter() // Not strictly needed for NextAuth signOut

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLogout = async () => {
    // ✅ NextAuth Logout
    await signOut({ callbackUrl: '/login' })
  }

  // ... keep variants and the rest of the JSX EXACTLY the same ...
  // (Just copy the rest of the return statement from the previous code)
  
  const sidebarVariants: Variants = {
    closed: { x: "-100%", transition: { type: "spring", stiffness: 400, damping: 40 } },
    open: { x: 0, transition: { type: "spring", stiffness: 400, damping: 40, staggerChildren: 0.1, delayChildren: 0.2 } }
  }

  const itemVariants: Variants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  }

  return (
    <div className="lg:hidden block">
      {/* 1. TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="bg-black p-1.5 rounded-lg shadow-sm">
            <Building2 size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">CampusHire</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
          <Menu size={26} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
            <motion.div initial="closed" animate="open" exit="closed" variants={sidebarVariants} className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col">
              
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <span className="font-bold text-xl text-gray-900">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                   const isActive = pathname === item.href
                   return (
                     <motion.div key={item.href} variants={itemVariants}>
                       <Link href={item.href} onClick={() => setIsOpen(false)} className={`group flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive ? "bg-black text-white shadow-lg shadow-gray-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                         <div className="flex items-center gap-4">
                           <item.icon size={20} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} />
                           {item.name}
                         </div>
                         {!isActive && <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />}
                       </Link>
                     </motion.div>
                   )
                })}
              </nav>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                 <div className="flex items-center gap-3 mb-5 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-500"><UserCircle size={24} /></div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-gray-900 capitalize truncate">{role}</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail || "User Account"}</p>
                    </div>
                 </div>
                 <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-white border border-red-100 py-3.5 rounded-xl text-red-600 font-semibold text-sm hover:bg-red-50 hover:border-red-200 transition-all active:scale-95">
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