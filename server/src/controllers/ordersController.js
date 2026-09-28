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
    const {
      listingId,
      items = [],
      userId,
      customerName,
      customerEmail,
      avatarUrl,
      quantity = 1,
      storeId
    } = req.body;

    // Normalize order items: either an items array or a single listingId
    let orderItems = Array.isArray(items) && items.length > 0 ? items : [];
    if (orderItems.length === 0 && listingId) {
      orderItems = [{ listingId, quantity }];
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ error: 'At least one listing item is required' });
    }

    // 1. Fetch all listings involved
    const listingIds = orderItems.map((it) => it.listingId);
    const dbListings = await prisma.listing.findMany({
      where: { id: { in: listingIds } },
      include: { store: true },
    });

    if (dbListings.length === 0) {
      return res.status(404).json({ error: 'No matching listings found' });
    }

    const listingMap = new Map(dbListings.map((l) => [l.id, l]));

    // Check availability for all items
    for (const item of orderItems) {
      const listing = listingMap.get(item.listingId);
      if (!listing) {
        return res.status(404).json({ error: `Listing ${item.listingId} not found` });
      }
      const qty = item.quantity || 1;
      if (listing.bagsAvailable < qty) {
        return res.status(400).json({
          error: `Sorry, "${listing.title}" only has ${listing.bagsAvailable} bag(s) left!`
        });
      }
    }

    // 2. Ensure customer user exists (isolated user for this customer device)
    let customerUser;
    if (userId) {
      customerUser = await prisma.user.upsert({
        where: { id: userId },
        update: {
          name: customerName || undefined,
          avatarUrl: avatarUrl || undefined,
        },
        create: {
          id: userId,
          email: customerEmail || `${userId}@foodlink.demo`,
          name: customerName || 'Valued Customer',
          role: 'CUSTOMER',
          avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=70',
        },
      });
    } else {
      customerUser = await prisma.user.upsert({
        where: { email: 'demo.customer@foodlink.org' },
        update: {},
        create: {
          email: 'demo.customer@foodlink.org',
          name: customerName || 'Valued Customer',
          role: 'CUSTOMER',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=70',
        },
      });
    }

    // Determine target store
    const primaryListing = dbListings[0];
    const targetStoreId = primaryListing.storeId || storeId;
    let storeRecord = targetStoreId ? await prisma.store.findUnique({ where: { id: targetStoreId } }) : null;
    if (!storeRecord) {
      storeRecord = await prisma.store.upsert({
        where: { id: 'default-store' },
        update: {},
        create: {
          id: 'default-store',
          name: primaryListing.storeName || 'CAD Bakery',
          category: 'Bakery & Cafe',
          address: '422 St 178, Daun Penh, Phnom Penh',
        },
      });
    }

    // 3. Generate human-friendly 6-digit pickup code
    const sixDigitCode = String(Math.floor(100000 + Math.random() * 900000));
    const orderNumber = `#FS-${sixDigitCode}`;
    const pickupCode = sixDigitCode;

    // Calculate totals across all items
    let totalPrice = 0;
    let totalSavings = 0;
    let totalCo2 = 0;
    let totalQty = 0;

    const detailedItems = orderItems.map((it) => {
      const listing = listingMap.get(it.listingId);
      const qty = it.quantity || 1;
      const itemPrice = listing.price * qty;
      const itemSavings = Math.max(0, (listing.originalPrice - listing.price) * qty);
      const itemCo2 = (listing.co2SavedKg || 1.2) * qty;

      totalPrice += itemPrice;
      totalSavings += itemSavings;
      totalCo2 += itemCo2;
      totalQty += qty;

      return {
        listingId: listing.id,
        title: listing.title,
        price: listing.price,
        originalPrice: listing.originalPrice,
        photoUrl: listing.photoUrl,
        quantity: qty,
        subtotal: itemPrice,
      };
    });

    // 4. Atomic transaction: create order and decrement bags for each listing
    const txOps = [
      prisma.order.create({
        data: {
          orderNumber,
          pickupCode,
          qrCodeData: JSON.stringify({ items: detailedItems, sixDigitCode }),
          quantity: totalQty,
          totalPrice,
          status: 'PENDING',
          pickupDate: primaryListing.pickupDate || 'Today',
          pickupStart: primaryListing.pickupStart || '6:30 PM',
          pickupEnd: primaryListing.pickupEnd || '7:30 PM',
          co2SavedKg: totalCo2,
          moneySaved: totalSavings,
          userId: customerUser.id,
          storeId: storeRecord.id,
          listingId: primaryListing.id,
        },
        include: {
          listing: true,
          store: true,
          user: true,
        },
      }),
    ];

    // Decrement stock for each item
    for (const item of orderItems) {
      const listing = listingMap.get(item.listingId);
      const qty = item.quantity || 1;
      txOps.push(
        prisma.listing.update({
          where: { id: listing.id },
          data: {
            bagsAvailable: { decrement: qty },
            bagsSold: { increment: qty },
            status: listing.bagsAvailable - qty <= 0 ? 'SOLD_OUT' : 'ACTIVE',
          },
        })
      );
    }

    const [order, ...updatedListings] = await prisma.$transaction(txOps);

    // 5. Create notification for Merchant
    const itemsDescription = detailedItems.length > 1
      ? `${totalQty} bags (${detailedItems.map(i => `${i.quantity}x ${i.title}`).join(', ')})`
      : `${totalQty}x ${primaryListing.title}`;

    const merchantNotification = await prisma.notification.create({
      data: {
        type: 'ORDER_CONFIRMED',
        title: 'New Order Received!',
        message: `${customerUser.name} just claimed ${itemsDescription} (Code: ${pickupCode})`,
        listingId: primaryListing.id,
        orderId: order.id,
      },
    });

    const enrichedOrder = {
      ...order,
      items: detailedItems,
      digits: sixDigitCode.split(''),
      customerName: customerUser.name,
      customerEmail: customerUser.email,
    };

    // 6. Broadcast Real-Time via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('ORDER_CREATED', {
        order: enrichedOrder,
        listings: updatedListings,
        listing: updatedListings[0],
        notification: merchantNotification,
      });

      // Broadcast LISTING_UPDATED for every updated listing & update corresponding notification card
      for (const updatedListing of updatedListings) {
        io.emit('LISTING_UPDATED', updatedListing);

        try {
          const existingNotif = await prisma.notification.findFirst({
            where: { listingId: updatedListing.id, type: 'NEW_LISTING' },
            orderBy: { createdAt: 'desc' },
          });

          if (existingNotif) {
            const store = updatedListing.storeName || 'CAD Bakery';
            const priceNum = typeof updatedListing.price === 'number' ? updatedListing.price : parseFloat(updatedListing.price) || 4.99;
            const remaining = updatedListing.bagsAvailable;
            const isSoldOut = remaining <= 0;
            const notifTitle = isSoldOut ? 'Surplus Item Sold Out' : (existingNotif.title || 'Surplus Food Available');
            const notifMessage = isSoldOut
              ? `${store}'s "${updatedListing.title}" is now Sold Out!`
              : `${store} has "${updatedListing.title}" (${remaining} available for $${priceNum.toFixed(2)})`;

            const updatedNotif = await prisma.notification.update({
              where: { id: existingNotif.id },
              data: {
                title: notifTitle,
                message: notifMessage,
              },
            });

            const enriched = {
              ...updatedNotif,
              listing: updatedListing,
            };
            io.emit('NOTIFICATION_RECEIVED', enriched);
            io.emit('NEW_NOTIFICATION', enriched);
          }
        } catch (err) {
          console.warn('Error updating listing notification on order:', err.message);
        }
      }

      console.log(`[Socket.io] Broadcasted ORDER_CREATED: ${order.orderNumber} (Code: ${pickupCode}) by ${customerUser.name}`);
    }

    return res.status(201).json({
      success: true,
      order: enrichedOrder,
      listings: updatedListings,
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
    const { code, orderId } = req.body;

    if (!code && !orderId) {
      return res.status(400).json({ error: 'Pickup code or order ID is required' });
    }

    let order = null;

    // 1. Instant O(1) indexed lookup if orderId is provided
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { listing: true, user: true, store: true },
      });
    }

    // 2. Fallback to code lookup
    if (!order && code) {
      const cleanCode = String(code).trim().toUpperCase();
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { pickupCode: cleanCode },
            { orderNumber: cleanCode },
            { orderNumber: `#FS-${cleanCode}` },
            { orderNumber: cleanCode.startsWith('#') ? cleanCode : `#${cleanCode}` },
            { pickupCode: `SAVER-${cleanCode}` },
            { pickupCode: cleanCode.replace(/^#?FS-?/i, '') },
          ],
        },
        include: { listing: true, user: true, store: true },
      });
    }

    if (!order) {
      return res.status(404).json({ error: `No active order found with code "${code || orderId}"` });
    }

    // Return immediately if already completed, ensuring socket sync
    if (order.status === 'COMPLETED') {
      const io = req.app.get('io');
      if (io) {
        io.emit('PICKUP_VERIFIED', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          pickupCode: order.pickupCode,
          verifiedAt: order.verifiedAt || new Date(),
        });
      }
      return res.json({
        success: true,
        message: 'Order already verified!',
        order,
      });
    }

    const listingTitle = order.listing?.title || 'Surplus Food Bag';
    const storeName = order.store?.name || 'Store';

    // 3. Mark as COMPLETED, mark notifications read & safely update user stats
    const txOps = [
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          verifiedAt: new Date(),
        },
        include: { listing: true, user: true, store: true },
      }),
      prisma.notification.updateMany({
        where: { orderId: order.id },
        data: { isRead: true },
      }),
    ];

    if (order.userId) {
      txOps.push(
        prisma.user.updateMany({
          where: { id: order.userId },
          data: {
            mealsRescued: { increment: order.quantity || 1 },
            co2SavedKg: { increment: order.co2SavedKg || 1.2 },
            moneySaved: { increment: order.moneySaved || 5 },
          },
        })
      );
    }

    const [updatedOrder] = await prisma.$transaction(txOps);

    // 4. Broadcast Real-Time via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('PICKUP_VERIFIED', {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        pickupCode: updatedOrder.pickupCode,
        verifiedAt: updatedOrder.verifiedAt,
      });
      console.log(`[Socket.io] Broadcasted PICKUP_VERIFIED: ${updatedOrder.orderNumber} (Code: ${updatedOrder.pickupCode})`);
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

/**
 * GET /api/orders/lookup
 * Look up order details by 6-digit pickup code or orderNumber
 */
export async function lookupOrder(req, res) {
  try {
    const { code, orderId } = req.query;

    let order = null;

    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { listing: true, user: true, store: true },
      });
    }

    if (!order && code) {
      const cleanCode = String(code).trim().toUpperCase();
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { pickupCode: cleanCode },
            { orderNumber: cleanCode },
            { orderNumber: `#FS-${cleanCode}` },
            { orderNumber: cleanCode.startsWith('#') ? cleanCode : `#${cleanCode}` },
            { pickupCode: `SAVER-${cleanCode}` },
            { pickupCode: cleanCode.replace(/^#?FS-?/i, '') },
          ],
        },
        include: { listing: true, user: true, store: true },
      });
    }

    if (!order) {
      return res.status(404).json({ error: `No order found with code "${code || orderId}"` });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Error looking up order:', error);
    return res.status(500).json({ error: 'Failed to look up order', details: error.message });
  }
}
