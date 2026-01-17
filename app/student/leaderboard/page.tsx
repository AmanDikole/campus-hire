import { getLeaderboardData } from "@/actions/get-leaderboard"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Trophy, Star, Search, Building2, GraduationCap, DollarSign } from "lucide-react"

export default async function LeaderboardPage() {
  const stories = await getLeaderboardData()

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/30">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          
          {/* HERO SECTION */}
          <header className="mb-12 text-center py-10 bg-black rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-10 left-10"><Star className="animate-bounce" /></div>
              <div className="absolute bottom-10 right-10"><Trophy size={48} /></div>
            </div>
            
            <Trophy className="mx-auto mb-4 text-amber-400" size={54} />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Placement Hall of Fame</h1>
            <p className="text-gray-400 font-medium max-w-lg mx-auto">
              Celebrating the hard work and success of our students in the 2025-2026 Placement Season.
            </p>
          </header>

          {/* SUCCESS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories && stories.length > 0 ? (
              stories.map((story) => (
                <div 
                  key={story.id} 
                  className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative"
                >
                  <div className="absolute top-6 right-6 w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <Star className="text-amber-500 fill-amber-500" size={20} />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                      {story.student.profile?.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">
                        {story.student.profile?.fullName}
                      </h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                        <GraduationCap size={12} /> {story.student.profile?.branch}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                        <Building2 size={16} className="text-gray-400" />
                        {story.job.company}
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 font-black px-2 py-1 rounded-md uppercase">
                        Placed
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-medium">{story.job.title}</p>
                      <div className="flex items-center text-emerald-600 font-black text-sm">
                        <DollarSign size={14} /> {story.job.salary}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-bold">The season has just begun! Success stories will appear here soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}