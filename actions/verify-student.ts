'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function verifyStudentAction(profileId: string, status: boolean) {
  const session = await auth()
  if (session?.user?.role !== 'admin') return { error: "Access denied." }

  await db.profile.update({
    where: { id: profileId },
    data: { isVerified: status }
  })

  revalidatePath('/admin/verify')
  return { success: "Student status updated." }
}