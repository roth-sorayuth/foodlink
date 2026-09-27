import { prisma } from '../lib/prisma.js';

/**
 * GET /api/notifications
 * Fetch recent notifications
 */
export async function getNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return res.json({ success: true, notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ error: 'Failed to update notification', details: error.message });
  }
}

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(req, res) {
  try {
    await prisma.notification.updateMany({
      data: { isRead: true },
    });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ error: 'Failed to update notifications', details: error.message });
  }
}
