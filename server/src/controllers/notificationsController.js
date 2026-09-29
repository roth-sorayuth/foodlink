import { prisma } from '../lib/prisma.js';

/**
 * GET /api/notifications
 * Fetch recent notifications
 */
export async function getNotifications(req, res) {
  try {
    const { type, role } = req.query;
    const where = {};
    if (type) {
      where.type = type;
    } else if (role === 'customer') {
      where.type = 'NEW_LISTING';
    }

    const notifications = await prisma.notification.findMany({
      where,
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

    const orderIds = notifications.map((n) => n.orderId).filter(Boolean);
    let ordersMap = {};
    if (orderIds.length > 0) {
      const orders = await prisma.order.findMany({
        where: { id: { in: orderIds } },
        include: {
          listing: true,
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          store: true,
        },
      });
      ordersMap = Object.fromEntries(orders.map((o) => [o.id, o]));
    }

    const enriched = notifications.map((n) => {
      const order = n.orderId ? ordersMap[n.orderId] || null : null;
      const isCompleted = order?.status === 'COMPLETED';
      const listing = n.listingId ? listingsMap[n.listingId] || null : null;

      // Exclude previous action order notifications if the order was already confirmed/picked up (COMPLETED)
      if (n.type === 'ORDER_CONFIRMED' && (isCompleted || !order)) {
        return null;
      }

      // Never display a NEW_LISTING notification if the food listing does not exist in the database
      if (n.type === 'NEW_LISTING' && !listing) {
        return null;
      }

      return {
        ...n,
        listing,
        order,
        isRead: isCompleted ? true : n.isRead,
      };
    }).filter(Boolean);

    // Deduplicate so only the newest notification card per surplus product is returned
    const isCustomerQuery = type === 'NEW_LISTING' || role === 'customer';
    const seenListingIds = new Set();
    const uniqueEnriched = [];
    for (const item of enriched) {
      if (isCustomerQuery) {
        if (item.type !== 'NEW_LISTING') continue;
        const title = (item.title || '').toLowerCase();
        const msg = (item.message || '').toLowerCase();
        if (title.includes('order') || title.includes('pickup') || title.includes('claim')) continue;
        if (msg.includes('claimed') || msg.includes('verified') || msg.includes('code:')) continue;
      }
      if (item.type === 'NEW_LISTING' && item.listingId) {
        if (seenListingIds.has(item.listingId)) continue;
        seenListingIds.add(item.listingId);
      }
      uniqueEnriched.push(item);
    }

    return res.json(uniqueEnriched);
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
