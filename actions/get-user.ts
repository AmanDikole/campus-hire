'use server'

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function getUserSession() {
  const session = await auth()
  if (!session?.user?.id) return null

  // ✅ Fetch user and include the related College information
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      role: true,
      collegeId: true,
      college: { // This is what the sidebar needs for branding
        select: { name: true }
      }
    }
  })

  return user
}