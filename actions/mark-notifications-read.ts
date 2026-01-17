'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function markNotificationsReadAction() {
  const session = await auth()
  if (!session?.user) return

  await db.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false
    },
    data: { isRead: true }
  })
}