import { db } from "@/lib/db";

export async function getUnreadNotificationCount(userId: string) {
  return await db.notification.count({
    where: {
      userId: userId,
      isRead: false,
    },
  });
}