import { db } from "@/lib/db"
import { auth } from "@/auth"
import { VerificationRow } from "@/components/VerificationRow"
import { ShieldCheck, UserX } from "lucide-react"
import { redirect } from "next/navigation"

export default async function VerifyStudentsPage() {
  const session = await auth()
  
  // ✅ 1. Role-Based Access Control (RBAC)
  if (!session?.user || session.user.role !== 'admin') redirect('/login')

  // ✅ 2. Isolated Data Fetching for the specific College
  const pendingProfiles = await db.profile.findMany({
    where: {
      isVerified: false,
      user: { collegeId: session.user.collegeId } // Enforces tenant isolation
    },
    include: {
      user: { select: { email: true } }
    },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={32} />
          Verification Queue
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Approve student credentials (PRN, CGPA) to enable their job eligibility.
        </p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
        {pendingProfiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                <tr>
                  <th className="px-8 py-5">Student / PRN</th>
                  <th className="px-8 py-5">Academic Stats</th>
                  <th className="px-8 py-5">Branch</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pendingProfiles.map((profile) => (
                  <VerificationRow key={profile.id} profile={profile} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center">
            <UserX className="text-gray-200 mx-auto mb-4" size={48} />
            <p className="text-gray-400 font-bold">Queue is empty. No students pending verification.</p>
          </div>
        )}
      </div>
    </div>
  )
}