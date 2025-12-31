import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Bell, CheckCircle, XCircle, Info } from "lucide-react"

export default async function NotificationsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch notifications for this user
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('student_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <StudentSidebar />

      <main className="flex-1 p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
              <Bell size={24} className="text-gray-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
              <p className="text-gray-500">Updates on your applications and interviews.</p>
            </div>
          </div>

          <div className="space-y-4">
            {!notifications || notifications.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <Bell className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-500">No new notifications.</p>
              </div>
            ) : (
              notifications.map((note: any) => (
                <NotificationCard key={note.id} note={note} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// Client Component for the specific card style
function NotificationCard({ note }: { note: any }) {
  // Styles based on type
  const styles: any = {
    'success': { bg: 'bg-green-50', border: 'border-green-100', icon: <CheckCircle className="text-green-600" size={20} /> },
    'error': { bg: 'bg-red-50', border: 'border-red-100', icon: <XCircle className="text-red-600" size={20} /> },
    'info': { bg: 'bg-blue-50', border: 'border-blue-100', icon: <Info className="text-blue-600" size={20} /> },
  }

  const style = styles[note.type] || styles['info']

  return (
    <div className={`p-5 rounded-2xl border ${style.border} ${style.bg} flex gap-4 transition-all hover:shadow-sm`}>
      <div className="mt-1">{style.icon}</div>
      <div>
        <p className="text-gray-900 font-medium text-sm leading-relaxed">{note.message}</p>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(note.created_at).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}