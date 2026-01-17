'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function getUnreadCountAction() {
  const session = await auth()
  
  // 1. Basic Security Gate
  if (!session?.user) return 0

  // 2. Count all isRead: false notifications for this user
  const count = await db.notification.count({
    where: {
      userId: session.user.id,
      isRead: false
    }
  })

  return count
}