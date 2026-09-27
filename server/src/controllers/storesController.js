import { prisma } from '../lib/prisma.js';

/**
 * GET /api/stores
 * Fetch all stores
 */
export async function getStores(req, res) {
  try {
    const stores = await prisma.store.findMany({
      include: {
        listings: {
          where: { status: 'ACTIVE' },
        },
      },
    });
    return res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return res.status(500).json({ error: 'Failed to fetch stores', details: error.message });
  }
}

/**
 * GET /api/stores/:id
 * Fetch single store with its listings and reviews
 */
export async function getStoreById(req, res) {
  try {
    const { id } = req.params;
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        listings: { orderBy: { createdAt: 'desc' } },
        orders: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    return res.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    return res.status(500).json({ error: 'Failed to fetch store', details: error.message });
  }
}

/**
 * PATCH /api/stores/:id
 * Update store details or toggle accepting orders
 */
export async function updateStore(req, res) {
  try {
    const { id } = req.params;
    const updatedStore = await prisma.store.update({
      where: { id },
      data: req.body,
    });
    return res.json({ success: true, store: updatedStore });
  } catch (error) {
    console.error('Error updating store:', error);
    return res.status(500).json({ error: 'Failed to update store', details: error.message });
  }
}
