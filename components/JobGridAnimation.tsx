'use client'
import { motion } from "framer-motion"

export function JobGridAnimation({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {children}
    </motion.div>
  )
}