import { prisma } from '../lib/prisma.js';

/**
 * GET /api/notifications
 * Fetch recent notifications
 */
export async function getNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 40,
    });

    const listingIds = notifications.map((n) => n.listingId).filter(Boolean);
    let listingsMap = {};
    if (listingIds.length > 0) {
      const listings = await prisma.listing.findMany({
        where: { id: { in: listingIds } },
        include: { store: true },
      });
      listingsMap = Object.fromEntries(listings.map((l) => [l.id, l]));
    }

    const enriched = notifications.map((n) => ({
      ...n,
      listing: n.listingId ? listingsMap[n.listingId] || null : null,
    }));

    return res.json(enriched);
  } catch (error) {
    console.warn('Database unavailable, returning empty notifications array:', error.message);
    return res.json([]);
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
