import { prisma } from '../lib/prisma.js';

/**
 * GET /api/orders
 * Fetch orders with optional filters (storeId, userId, status)
 */
export async function getOrders(req, res) {
  try {
    const { storeId, userId, status } = req.query;

    const where = {};
    if (storeId) where.storeId = storeId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        listing: true,
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        store: true,
      },
    });

    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
}

/**
 * POST /api/orders
 * Customer places an order to rescue a surplus listing
 */
export async function createOrder(req, res) {
  try {
    const { listingId, userId, quantity = 1, storeId } = req.body;

    if (!listingId) {
      return res.status(400).json({ error: 'listingId is required' });
    }

    // 1. Fetch the listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { store: true },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.bagsAvailable < quantity) {
      return res.status(400).json({ error: 'Sorry, this listing has no bags left!' });
    }

    // 2. Ensure customer user exists (use default or passed user)
    let customerUser;
    if (userId) {
      customerUser = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!customerUser) {
      // Find or create default demo user
      customerUser = await prisma.user.upsert({
        where: { email: 'sarah.jenkins@foodlink.org' },
        update: {},
        create: {
          email: 'sarah.jenkins@foodlink.org',
          name: 'Sarah Jenkins',
          role: 'CUSTOMER',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        },
      });
    }

    // Ensure store exists
    const targetStoreId = listing.storeId || storeId;
    let storeRecord = targetStoreId ? await prisma.store.findUnique({ where: { id: targetStoreId } }) : null;
    if (!storeRecord) {
      storeRecord = await prisma.store.upsert({
        where: { id: 'default-store' },
        update: {},
        create: {
          id: 'default-store',
          name: listing.storeName || 'Artisan Bakery & Cafe',
          category: 'Bakery & Cafe',
          address: '422 Mission St, San Francisco, CA',
        },
      });
    }

    // 3. Generate human-friendly codes
    const orderNumber = `#FS-${Math.floor(10000 + Math.random() * 90000)}`;
    const pickupCode = `SAVER-${Math.floor(100 + Math.random() * 900)}`;
    const totalPrice = listing.price * quantity;
    const savings = Math.max(0, (listing.originalPrice - listing.price) * quantity);
    const co2Saved = listing.co2SavedKg * quantity;

    // 4. Create Order and update Listing bags atomically in a transaction
    const [order, updatedListing] = await prisma.$transaction([
      prisma.order.create({
        data: {
          orderNumber,
          pickupCode,
          quantity,
          totalPrice,
          status: 'PENDING',
          pickupDate: listing.pickupDate || 'Today',
          pickupStart: listing.pickupStart || '6:30 PM',
          pickupEnd: listing.pickupEnd || '7:30 PM',
          co2SavedKg: co2Saved,
          moneySaved: savings,
          userId: customerUser.id,
          storeId: storeRecord.id,
          listingId: listing.id,
        },
        include: {
          listing: true,
          store: true,
          user: true,
        },
      }),
      prisma.listing.update({
        where: { id: listing.id },
        data: {
          bagsAvailable: { decrement: quantity },
          bagsSold: { increment: quantity },
          status: listing.bagsAvailable - quantity <= 0 ? 'SOLD_OUT' : 'ACTIVE',
        },
      }),
    ]);

    // 5. Create notification for Merchant
    const merchantNotification = await prisma.notification.create({
      data: {
        type: 'ORDER_CONFIRMED',
        title: 'New Order Received!',
        message: `${customerUser.name} just claimed 1x ${listing.title} (${pickupCode})`,
        listingId: listing.id,
        orderId: order.id,
      },
    });

    // 6. Broadcast Real-Time via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('ORDER_CREATED', {
        order,
        listing: updatedListing,
        notification: merchantNotification,
      });
      console.log(`[Socket.io] Broadcasted ORDER_CREATED: ${order.orderNumber} (${pickupCode})`);
    }

    return res.status(201).json({
      success: true,
      order,
      listing: updatedListing,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
}

/**
 * POST /api/orders/verify
 * Merchant verifies customer pickup using pickupCode or orderNumber
 */
export async function verifyPickup(req, res) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Pickup code or order number is required' });
    }

    const cleanCode = code.trim().toUpperCase();

    // Find matching order
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { pickupCode: cleanCode },
          { orderNumber: cleanCode },
          { pickupCode: `SAVER-${cleanCode}` },
        ],
      },
      include: {
        listing: true,
        user: true,
        store: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: `No active order found with code "${cleanCode}"` });
    }

    if (order.status === 'COMPLETED') {
      return res.status(400).json({
        error: 'This order has already been verified and picked up!',
        order,
      });
    }

    // Mark as COMPLETED & update user impact stats
    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          verifiedAt: new Date(),
        },
        include: { listing: true, user: true, store: true },
      }),
      prisma.user.update({
        where: { id: order.userId },
        data: {
          mealsRescued: { increment: order.quantity },
          co2SavedKg: { increment: order.co2SavedKg },
          moneySaved: { increment: order.moneySaved },
        },
      }),
      prisma.notification.create({
        data: {
          type: 'PICKUP_VERIFIED',
          title: 'Pickup Confirmed! 🎉',
          message: `Your pickup for ${order.listing.title} at ${order.store.name} was successfully verified!`,
          orderId: order.id,
          userId: order.userId,
        },
      }),
    ]);

    // Broadcast Real-Time via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('PICKUP_VERIFIED', {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        pickupCode: updatedOrder.pickupCode,
        verifiedAt: updatedOrder.verifiedAt,
      });
      console.log(`[Socket.io] Broadcasted PICKUP_VERIFIED: ${updatedOrder.orderNumber}`);
    }

    return res.json({
      success: true,
      message: 'Pickup verified successfully!',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error verifying pickup:', error);
    return res.status(500).json({ error: 'Failed to verify pickup', details: error.message });
  }
}
