import { prisma } from '../lib/prisma.js';

/**
 * GET /api/listings
 * Fetch active listings with optional category, search, and status filters
 */
export async function getListings(req, res) {
  try {
    const { category, search, status } = req.query;

    const where = {};

    if (category && category !== 'all') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { storeName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { store: true },
    });

    return res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return res.status(500).json({ error: 'Failed to fetch listings', details: error.message });
  }
}

/**
 * GET /api/listings/:id
 * Fetch a single listing by ID
 */
export async function getListingById(req, res) {
  try {
    const { id } = req.params;
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { store: true },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    return res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return res.status(500).json({ error: 'Failed to fetch listing', details: error.message });
  }
}

/**
 * POST /api/listings
 * Create a new surplus food listing, save to DB, and broadcast via Socket.io
 */
export async function createListing(req, res) {
  try {
    const {
      title,
      description,
      photoUrl,
      originalPrice,
      price,
      discount,
      bagsAvailable,
      category,
      pickupDate,
      pickupStart,
      pickupEnd,
      storeName,
      storeId,
      dietaryTags,
      co2SavedKg,
    } = req.body;

    if (!title || price === undefined || originalPrice === undefined) {
      return res.status(400).json({ error: 'Title, price, and originalPrice are required' });
    }

    const priceNum = parseFloat(price);
    const origNum = parseFloat(originalPrice);
    const calculatedDiscount =
      discount ||
      (origNum > 0
        ? `${Math.round(((origNum - priceNum) / origNum) * 100)}% OFF`
        : '50% OFF');

    // Verify storeId exists in DB to prevent foreign key errors
    let resolvedStoreId = null;
    let resolvedStoreName = storeName || 'CAD Bakery';
    if (storeId) {
      const storeExists = await prisma.store.findUnique({ where: { id: storeId } });
      if (storeExists) {
        resolvedStoreId = storeId;
        resolvedStoreName = storeExists.name || resolvedStoreName;
      }
    }

    // 1. Save listing in PostgreSQL
    const savedListing = await prisma.listing.create({
      data: {
        title,
        description: description || '',
        photoUrl:
          photoUrl ||
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
        originalPrice: origNum,
        price: priceNum,
        discount: calculatedDiscount,
        bagsAvailable: parseInt(bagsAvailable, 10) || 5,
        category: category || 'baked',
        pickupDate: pickupDate || 'Today',
        pickupStart: pickupStart || '6:30 PM',
        pickupEnd: pickupEnd || '7:30 PM',
        storeName: resolvedStoreName,
        storeId: resolvedStoreId,
        dietaryTags: Array.isArray(dietaryTags) ? dietaryTags : [],
        co2SavedKg: parseFloat(co2SavedKg) || 1.2,
      },
      include: { store: true },
    });

    // 2. Create notification record in PostgreSQL
    const savedNotification = await prisma.notification.create({
      data: {
        type: 'NEW_LISTING',
        title: 'New Surplus Food Available!',
        message: `${savedListing.storeName} just listed "${savedListing.title}" for $${savedListing.price.toFixed(2)}`,
        listingId: savedListing.id,
      },
    });

    const enrichedNotification = {
      ...savedNotification,
      listing: savedListing,
    };

    // 3. Broadcast real-time event to all connected customer tabs via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('NEW_LISTING', {
        listing: savedListing,
        notification: enrichedNotification,
      });
      io.emit('NOTIFICATION_RECEIVED', enrichedNotification);
      console.log(`[Socket.io] Broadcasted NEW_LISTING: "${savedListing.title}"`);
    }

    return res.status(201).json({
      success: true,
      listing: savedListing,
      notification: enrichedNotification,
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    return res.status(500).json({ error: 'Failed to create listing', details: error.message });
  }
}

/**
 * PATCH /api/listings/:id
 * Update listing details or bags quantity
 */
export async function updateListing(req, res) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.bagsAvailable !== undefined) updateData.bagsAvailable = parseInt(updateData.bagsAvailable, 10);
    if (updateData.bagsSold !== undefined) updateData.bagsSold = parseInt(updateData.bagsSold, 10);

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('LISTING_UPDATED', updatedListing);
    }

    return res.json({ success: true, listing: updatedListing });
  } catch (error) {
    console.error('Error updating listing:', error);
    return res.status(500).json({ error: 'Failed to update listing', details: error.message });
  }
}

/**
 * DELETE /api/listings/:id
 * Remove a listing
 */
export async function deleteListing(req, res) {
  try {
    const { id } = req.params;
    await prisma.listing.delete({ where: { id } });

    const io = req.app.get('io');
    if (io) {
      io.emit('LISTING_DELETED', { id });
    }

    return res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return res.status(500).json({ error: 'Failed to delete listing', details: error.message });
  }
}
