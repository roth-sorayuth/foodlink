import { prisma } from '../lib/prisma.js';

const FALLBACK_LISTINGS = [
  {
    id: 'cad-sourdough-box',
    title: 'Artisan Sourdough & Croissant Surprise Box',
    description: 'European artisan rustic sourdough loaves, buttery croissants, pain au chocolat, and daily fruit danishes.',
    category: 'baked',
    photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
    originalPrice: 16.00,
    price: 4.99,
    discount: '69% OFF',
    bagsAvailable: 4,
    bagsSold: 18,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '6:30 PM',
    pickupEnd: '7:30 PM',
    dietaryTags: ['vegetarian', 'artisan', 'bakery'],
    co2SavedKg: 2.5,
    storeName: 'CAD Bakery',
    storeLogo: '/cad-bakery-logo.png',
    store: {
      id: 'st_cad',
      name: 'CAD Bakery',
      rating: 4.9,
      distance: '0.4 km',
      address: '422 St 178, Daun Penh',
    }
  },
  {
    id: 'cad-croissant-bundle',
    title: 'French Butter Croissant & Viennoiserie Bag',
    description: 'Pure French butter croissants, almond escargot pastries, chocolate swirls, and buttery brioche buns.',
    category: 'baked',
    photoUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
    originalPrice: 13.50,
    price: 3.99,
    discount: '70% OFF',
    bagsAvailable: 5,
    bagsSold: 22,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '6:00 PM',
    pickupEnd: '7:30 PM',
    dietaryTags: ['vegetarian', 'pastry'],
    co2SavedKg: 2.1,
    storeName: 'CAD Bakery',
    storeLogo: '/cad-bakery-logo.png',
    store: {
      id: 'st_cad',
      name: 'CAD Bakery',
      rating: 4.9,
      distance: '0.4 km',
      address: '422 St 178, Daun Penh',
    }
  },
  {
    id: 'cad-rustic-breads',
    title: 'Rustic Country Sourdough & Baguette Pack',
    description: 'Two full-size artisan sourdough boules and crispy European baguettes freshly baked with organic wheat flour.',
    category: 'baked',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    originalPrice: 12.00,
    price: 3.50,
    discount: '71% OFF',
    bagsAvailable: 3,
    bagsSold: 14,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '6:30 PM',
    pickupEnd: '8:00 PM',
    dietaryTags: ['vegan', 'organic'],
    co2SavedKg: 1.8,
    storeName: 'CAD Bakery',
    storeLogo: '/cad-bakery-logo.png',
    store: {
      id: 'st_cad',
      name: 'CAD Bakery',
      rating: 4.9,
      distance: '0.4 km',
      address: '422 St 178, Daun Penh',
    }
  },
  {
    id: 'cad-sweet-dessert-box',
    title: 'Sweet Tartlets, Cakes & Danish Treats',
    description: 'Fresh fruit tarts, custard brioches, cinnamon glazed knots, and seasonal pastry slices from today.',
    category: 'dessert',
    photoUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    originalPrice: 15.00,
    price: 4.50,
    discount: '70% OFF',
    bagsAvailable: 3,
    bagsSold: 9,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '7:00 PM',
    pickupEnd: '8:30 PM',
    dietaryTags: ['dessert', 'sweet'],
    co2SavedKg: 1.9,
    storeName: 'CAD Bakery',
    storeLogo: '/cad-bakery-logo.png',
    store: {
      id: 'st_cad',
      name: 'CAD Bakery',
      rating: 4.9,
      distance: '0.4 km',
      address: '422 St 178, Daun Penh',
    }
  },
  {
    id: 'cad-savory-focaccia',
    title: 'Savory Focaccia & Stuffed Brioche Box',
    description: 'Rosemary sea salt focaccia squares, ham and gruyere melt twists, and savory olive rolls.',
    category: 'meals',
    photoUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    originalPrice: 14.00,
    price: 4.20,
    discount: '70% OFF',
    bagsAvailable: 2,
    bagsSold: 11,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '6:00 PM',
    pickupEnd: '7:30 PM',
    dietaryTags: ['savory', 'meals'],
    co2SavedKg: 2.0,
    storeName: 'CAD Bakery',
    storeLogo: '/cad-bakery-logo.png',
    store: {
      id: 'st_cad',
      name: 'CAD Bakery',
      rating: 4.9,
      distance: '0.4 km',
      address: '422 St 178, Daun Penh',
    }
  },
  {
    id: 'cad-coffee-pastry-pair',
    title: 'Barista Cold Brew & Afternoon Pastry Pair',
    description: 'Bottled organic cold brew coffee or iced matcha latte paired with two fresh breakfast pastries.',
    category: 'drinks',
    photoUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    originalPrice: 9.00,
    price: 2.90,
    discount: '68% OFF',
    bagsAvailable: 6,
    bagsSold: 15,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '5:30 PM',
    pickupEnd: '7:00 PM',
    dietaryTags: ['drinks', 'cafe'],
    co2SavedKg: 1.2,
    storeName: 'CAD Bakery',
    storeLogo: '/cad-bakery-logo.png',
    store: {
      id: 'st_cad',
      name: 'CAD Bakery',
      rating: 4.9,
      distance: '0.4 km',
      address: '422 St 178, Daun Penh',
    }
  },
  {
    id: 'mori-bistro',
    title: 'Japanese Donburi & Bento Surprise Bag',
    description: 'Fresh teriyaki chicken, katsu curry, or daily sushi roll surplus prepared today.',
    category: 'meals',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    originalPrice: 3.60,
    price: 1.80,
    discount: '50% OFF',
    bagsAvailable: 3,
    bagsSold: 7,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '10:00 AM',
    pickupEnd: '9:00 PM',
    dietaryTags: ['fresh', 'asian'],
    co2SavedKg: 1.5,
    storeName: 'Mori Bistro',
    store: {
      id: 'store-mori',
      name: 'Mori Bistro',
      rating: 4.7,
      distance: '1.7 km',
      address: '58 Street R8, Daun Penh',
    }
  },
  {
    id: 'aus-bake',
    title: 'Baking Pastries in Cambodia Since 2003',
    description: 'Assortment of fresh meat pies, sausage rolls, spinach feta parcels and sweet danishes.',
    category: 'baked',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    originalPrice: 5.00,
    price: 2.50,
    discount: '50% OFF',
    bagsAvailable: 5,
    bagsSold: 12,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '11:00 AM',
    pickupEnd: '8:30 PM',
    dietaryTags: ['pastry', 'bakery'],
    co2SavedKg: 2.0,
    storeName: 'AusBake Pastries',
    store: {
      id: 'store-ausbake',
      name: 'AusBake Pastries',
      rating: 4.8,
      distance: '2.1 km',
      address: '32 St 113, Boeng Keng Kang',
    }
  }
];

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

    return res.json(listings.length > 0 ? listings : FALLBACK_LISTINGS);
  } catch (error) {
    console.warn('Database unavailable, returning fallback listings:', error.message);
    let results = [...FALLBACK_LISTINGS];
    const { category, search } = req.query;
    if (category && category !== 'all') {
      results = results.filter(l => l.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(l => l.title?.toLowerCase().includes(q) || l.storeName?.toLowerCase().includes(q));
    }
    return res.json(results);
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
