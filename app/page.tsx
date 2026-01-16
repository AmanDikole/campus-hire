import Link from "next/link"
import { Building2, CheckCircle, ArrowRight, ShieldCheck, BarChart3, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
      
      {/* 1. Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">C</div>
            CampusHire
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Now serving 50+ Colleges</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gray-900">
            Placement Automation <br />
            <span className="text-gray-400">for Modern Campuses.</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Replace chaotic spreadsheets with a dedicated placement portal. 
            Streamline drives, track applications, and boost hiring rates in one secure platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="h-14 px-8 rounded-full bg-black text-white font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-gray-200">
              Request Demo <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="h-14 px-8 rounded-full bg-white border border-gray-200 text-gray-900 font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
              View Live Portal
            </Link>
          </div>
        </div>

        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-gray-50 to-white rounded-full blur-3xl -z-10 opacity-60" />
      </section>

      {/* 3. Social Proof (Trusted By) */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by Top Institutes</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 grayscale opacity-50">
             {/* Fake Logos for Demo */}
             <span className="text-xl font-bold text-gray-900">MIT WPU</span>
             <span className="text-xl font-bold text-gray-900">COEP Tech</span>
             <span className="text-xl font-bold text-gray-900">IIT Bombay</span>
             <span className="text-xl font-bold text-gray-900">VIT Pune</span>
             <span className="text-xl font-bold text-gray-900">PICT</span>
          </div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Tenant Security</h3>
              <p className="text-gray-500 leading-relaxed">
                Complete data isolation. MIT data stays at MIT. COEP data stays at COEP. Enterprise-grade security for every campus.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Company Management</h3>
              <p className="text-gray-500 leading-relaxed">
                Create detailed job drives with eligibility criteria (CGPA, Branch). Students only see jobs they are eligible for.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-gray-500 leading-relaxed">
                Track placement percentages, branch-wise participation, and offer letters with beautiful interactive charts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Big CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-black text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
             
             {/* Gradient Blob */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-800/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10">
               <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to digitize your placements?</h2>
               <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
                 Join 50+ forward-thinking colleges using CampusHire to place students faster and easier.
               </p>
               <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
                 Start Free Pilot <CheckCircle size={18} />
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 CampusHire Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}