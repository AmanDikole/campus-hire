import { getStudentStats } from "@/actions/get-student-stats"
import { Briefcase, Clock, Trophy, ChevronRight } from "lucide-react"
import Link from "next/link"

export async function StatsGallery() {
  const stats = await getStudentStats()

  if (!stats) return null

  const cards = [
    { 
        label: "Active Drives", 
        value: stats.activeDrives, 
        icon: Briefcase, 
        color: "text-blue-600", 
        bg: "bg-blue-50",
        link: "/student" 
    },
    { 
        label: "Pending Results", 
        value: stats.pendingApps, 
        icon: Clock, 
        color: "text-amber-600", 
        bg: "bg-amber-50",
        link: "/student/applications" 
    },
    { 
        label: "Shortlisted", 
        value: stats.shortlisted, 
        icon: Trophy, 
        color: "text-emerald-600", 
        bg: "bg-emerald-50",
        link: "/student/applications" 
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <Link 
          key={card.label} 
          href={card.link}
          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className={`${card.bg} ${card.color} p-4 rounded-2xl`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none">{card.value}</p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">{card.label}</p>
            </div>
          </div>
          <ChevronRight className="text-gray-200 group-hover:text-gray-400 transition-colors" size={20} />
        </Link>
      ))}
    </div>
  )
}