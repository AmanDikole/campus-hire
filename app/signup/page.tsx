import { db } from "@/lib/db"
import { RegisterForm } from "@/components/RegisterForm"
import { Building2 } from "lucide-react"
import Link from "next/link"

export default async function SignupPage() {
  // ✅ Fetch active colleges to populate the dropdown
  const colleges = await db.college.findMany({
    select: { id: true, name: true }
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl shadow-gray-200 border border-white">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-300">
            <Building2 size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-sm mt-2">Join your college placement cell today.</p>
        </div>

        {/* Pass colleges to the Client Component form */}
        <RegisterForm colleges={colleges} />

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="font-bold text-black hover:underline">Sign in</Link>
        </div>

      </div>
    </div>
  )
}