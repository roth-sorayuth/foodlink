import { prisma } from '../lib/prisma.js';

/**
 * GET /api/analytics/merchant
 * Dashboard stats for merchant analytics
 */
export async function getMerchantStats(req, res) {
  try {
    const [totalListings, activeListings, totalOrders, completedOrders] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.order.findMany({ where: { status: 'COMPLETED' } }),
    ]);

    const totalRevenue = completedOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const totalCo2Saved = completedOrders.reduce((acc, curr) => acc + curr.co2SavedKg, 0);
    const totalRescued = completedOrders.reduce((acc, curr) => acc + curr.quantity, 0);

    return res.json({
      totalListings,
      activeListings,
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      totalCo2Saved: totalCo2Saved.toFixed(1),
      mealsRescued: totalRescued,
    });
  } catch (error) {
    console.error('Error fetching merchant stats:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
  }
}

/**
 * GET /api/users/profile
 * Get or create current demo customer profile with stats
 */
export async function getCustomerProfile(req, res) {
  try {
    const user = await prisma.user.upsert({
      where: { email: 'sarah.jenkins@foodlink.org' },
      update: {},
      create: {
        email: 'sarah.jenkins@foodlink.org',
        name: 'Sarah Jenkins',
        role: 'CUSTOMER',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        mealsRescued: 14,
        co2SavedKg: 28.5,
        moneySaved: 94.5,
      },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { listing: true, store: true },
        },
      },
    });

    return res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
  }
}
