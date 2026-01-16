import { db } from "@/lib/db"
import { auth } from "@/auth"
import { StudentSidebar } from "@/components/StudentSidebar"
import { ProfileForm } from "@/components/ProfileForm"
import { redirect } from "next/navigation"

export default async function StudentProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  // Fetch existing profile
  const profile = await db.profile.findUnique({
    where: { userId: session.user.id }
  })

  // Fallback if no profile exists (shouldn't happen due to register logic)
  if (!profile) return <div>Profile not found</div>

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <StudentSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
            <p className="text-gray-500 mt-2">Keep your academic details up to date to apply for drives.</p>
          </div>

          <ProfileForm profile={profile} />
          
        </div>
      </main>
    </div>
  )
}