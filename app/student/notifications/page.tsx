import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Bell, CheckCircle, XCircle, Info, Clock } from "lucide-react"

export default async function NotificationsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch notifications for this student
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('student_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <StudentSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-900">
                <Bell size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
                <p className="text-gray-500">Updates on your applications and interviews.</p>
            </div>
          </div>

          <div className="space-y-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((note: any) => (
                <NotificationCard key={note.id} note={note} />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="text-gray-300" size={24} />
                </div>
                <p className="text-gray-500">No new notifications.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

function NotificationCard({ note }: { note: any }) {
  // Determine Icon and Color based on notification type
  let icon = <Info size={20} />
  let colorClass = "bg-blue-50 text-blue-700 border-blue-100"

  if (note.type === 'success' || note.message.includes('Shortlisted')) {
    icon = <CheckCircle size={20} />
    colorClass = "bg-green-50 text-green-700 border-green-100"
  } else if (note.type === 'error' || note.message.includes('Rejected')) {
    icon = <XCircle size={20} />
    colorClass = "bg-red-50 text-red-700 border-red-100"
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
      <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-gray-900 font-medium leading-relaxed">{note.message}</p>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Clock size={12} /> {new Date(note.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  )
}