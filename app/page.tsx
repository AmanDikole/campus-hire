'use client'
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { 
  ArrowRight, Building2, GraduationCap, Briefcase, 
  Sparkles
} from "lucide-react"

export default function LandingPage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* 1. NAVBAR (Glassmorphism) */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black p-1.5 rounded-lg">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CampusHire</span>
          </div>
          <div className="flex gap-4">
             <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors px-4 py-2">
               Sign In
             </Link>
             <Link href="/signup" className="text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
               Get Started
             </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION WITH ANIMATED MESH */}
      <main className="relative pt-32 pb-20 px-6 lg:pt-48">
        
        {/* Animated Blobs Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <motion.div style={{ y: y1 }} className="absolute top-20 left-[20%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></motion.div>
          <motion.div style={{ y: y2 }} className="absolute top-20 right-[20%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></motion.div>
          <div className="absolute -bottom-32 left-[30%] w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={containerVariants}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 text-sm font-medium mb-8 hover:bg-gray-50 transition-colors cursor-default">
            <Sparkles size={14} className="text-yellow-500" />
            <span>Trusted by 500+ Top Colleges</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter mb-8 leading-[1.1]">
            Your Dream Job, <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">One Click Away.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed">
            The all-in-one placement platform. Students build profiles, Admins manage drives, and Companies hire talent faster than ever.
          </motion.p>

          {/* ROLE CARDS */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Student Card */}
            <Link href="/login" className="group relative overflow-hidden bg-white hover:bg-gray-50 border border-gray-200 p-8 rounded-[2rem] text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap size={28} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">I am a Student</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">Build your digital resume, browse exclusive campus drives, and track applications in real-time.</p>
              <div className="flex items-center text-blue-600 font-bold group-hover:gap-3 transition-all">
                Student Login <ArrowRight size={18} className="ml-2" />
              </div>
            </Link>

            {/* Admin Card */}
            <Link href="/login" className="group relative overflow-hidden bg-black hover:bg-zinc-900 border border-black p-8 rounded-[2rem] text-left transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/20 hover:-translate-y-1">
              <div className="bg-zinc-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">I am an Admin</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">Post jobs, shortlist candidates with one click, and export hiring data instantly.</p>
              <div className="flex items-center text-white font-bold group-hover:gap-3 transition-all">
                Admin Dashboard <ArrowRight size={18} className="ml-2" />
              </div>
            </Link>

          </motion.div>
        </motion.div>
      </main>

      {/* 3. INFINITE LOGO TICKER */}
      <div className="w-full bg-white border-y border-gray-100 py-10 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <div className="flex w-[200%] animate-scroll">
          {/* We repeat the list twice for seamless loop */}
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className="flex-1 flex justify-center items-center min-w-[150px] opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
              <span className="text-xl font-bold font-mono">{logo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. STATS SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBox val="500+" label="Companies Hiring" />
            <StatBox val="12k+" label="Students Placed" />
            <StatBox val="98%" label="Placement Rate" />
            <StatBox val="24h" label="Fastest Offer" />
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-12 border-t border-gray-200 bg-white">
         <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="bg-black p-1.5 rounded-lg">
                 <Building2 size={16} className="text-white" />
               </div>
               <span className="font-bold text-lg text-gray-900">CampusHire</span>
            </div>
            <p className="text-gray-500 text-sm">© 2024 CampusHire Inc. Built for Students.</p>
            <div className="flex gap-6">
               <a href="#" className="text-gray-400 hover:text-black transition-colors">Privacy</a>
               <a href="#" className="text-gray-400 hover:text-black transition-colors">Terms</a>
               <a href="#" className="text-gray-400 hover:text-black transition-colors">Twitter</a>
            </div>
         </div>
      </footer>
    </div>
  )
}

// Components & Data
const logos = ["GOOGLE", "MICROSOFT", "AMAZON", "NETFLIX", "META", "UBER", "AIRBNB", "SPOTIFY"]

function StatBox({ val, label }: { val: string; label: string }) {
  return (
    <div className="text-center">
      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{val}</h3>
      <p className="text-gray-500 font-medium">{label}</p>
    </div>
  )
}