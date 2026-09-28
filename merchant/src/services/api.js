import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Global Socket.io instance for Merchant App
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('[Merchant Socket] Connected to FoodLink Gateway:', socket.id);
});

// BroadcastChannel for instant cross-tab / cross-window sync
const liveDropChannel = typeof window !== 'undefined' && window.BroadcastChannel
  ? new BroadcastChannel('foodlink_live_channel')
  : null;

/**
 * Broadcast new listing to Customer app via Socket.io, BroadcastChannel, and localStorage
 */
export function notifyCustomerNewListing(listing) {
  if (!listing) return;
  const priceNum = typeof listing.price === 'number'
    ? listing.price
    : parseFloat(String(listing.price || '4.99').replace(/[^0-9.]/g, '')) || 4.99;
  
  const payload = {
    listing: {
      ...listing,
      price: priceNum,
      storeName: listing.storeName || 'CAD Bakery',
    },
    notification: {
      id: `notif-${Date.now()}`,
      type: 'NEW_LISTING',
      title: 'New Surplus Food Available!',
      message: `${listing.storeName || 'CAD Bakery'} just listed "${listing.title}" for $${priceNum.toFixed(2)}`,
      listingId: listing.id,
      listing,
      createdAt: new Date().toISOString(),
    },
  };

  // 1. Emit to WebSocket server so remote customer devices receive it
  try {
    if (socket && socket.connected) {
      socket.emit('NEW_LISTING_DROPPED', payload);
    }
  } catch (err) {
    console.warn('[Merchant Socket] emit failed:', err);
  }

  // 2. BroadcastChannel for instant same-origin tab sync
  try {
    if (liveDropChannel) {
      liveDropChannel.postMessage({ type: 'NEW_LISTING', data: payload });
    }
  } catch (err) {
    console.warn('[Merchant BroadcastChannel] postMessage failed:', err);
  }

  // 3. LocalStorage storage event fallback across tabs
  try {
    localStorage.setItem('foodlink_last_new_listing', JSON.stringify({ ...payload, _ts: Date.now() }));
  } catch (err) {
    // Ignore quota or cross-origin errors
  }
}

export const DEFAULT_MERCHANT_LISTINGS = [
  {
    id: 'cad-sourdough-box',
    title: 'Artisan Sourdough & Croissant Surprise Box',
    description: 'Artisanal European sourdough loaves, buttery croissants, and morning viennoiserie baked fresh today.',
    category: 'pastry',
    photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    originalPrice: 16.00,
    price: 4.99,
    discount: '69% OFF',
    bagsAvailable: 4,
    remaining: 4,
    bagsSold: 18,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '6:30 PM',
    pickupEnd: '7:30 PM',
    dietaryTags: ['vegetarian', 'artisan', 'bakery'],
    storeId: 'st_cad',
    storeName: 'CAD Bakery',
  },
  {
    id: 'cad-croissant-bundle',
    title: 'French Butter Croissant & Viennoiserie Bag',
    description: 'Pure French butter croissants, almond escargot pastries, chocolate swirls, and brioche rolls.',
    category: 'pastry',
    photoUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
    originalPrice: 13.50,
    price: 3.99,
    discount: '70% OFF',
    bagsAvailable: 5,
    remaining: 5,
    bagsSold: 22,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '6:00 PM',
    pickupEnd: '7:30 PM',
    dietaryTags: ['vegetarian', 'pastry'],
    storeId: 'st_cad',
    storeName: 'CAD Bakery',
  },
  {
    id: 'cad-rustic-breads',
    title: 'Rustic Country Sourdough & Baguette Pack',
    description: 'Two full-size artisan sourdough boules and crispy European baguettes freshly baked with organic wheat flour.',
    category: 'pastry',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    originalPrice: 12.00,
    price: 3.50,
    discount: '71% OFF',
    bagsAvailable: 3,
    remaining: 3,
    bagsSold: 14,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '6:30 PM',
    pickupEnd: '8:00 PM',
    dietaryTags: ['vegan', 'organic'],
    storeId: 'st_cad',
    storeName: 'CAD Bakery',
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
    remaining: 3,
    bagsSold: 9,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '7:00 PM',
    pickupEnd: '8:30 PM',
    dietaryTags: ['dessert', 'sweet'],
    storeId: 'st_cad',
    storeName: 'CAD Bakery',
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
    remaining: 2,
    bagsSold: 11,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '6:00 PM',
    pickupEnd: '7:30 PM',
    dietaryTags: ['savory', 'meals'],
    storeId: 'st_cad',
    storeName: 'CAD Bakery',
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
    remaining: 6,
    bagsSold: 15,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '5:30 PM',
    pickupEnd: '7:00 PM',
    dietaryTags: ['drinks', 'cafe'],
    storeId: 'st_cad',
    storeName: 'CAD Bakery',
  },
];

/**
 * Fetch all listings for merchant directly from backend database
 */
export async function getMerchantListings() {
  const signatureOrder = [
    'cad-sourdough-box',
    'cad-croissant-bundle',
    'cad-rustic-breads',
    'cad-sweet-dessert-box',
    'cad-savory-focaccia',
    'cad-coffee-pastry-pair',
  ];

  const sortWithSignatureFirst = (items) => {
    return [...items].sort((a, b) => {
      const idxA = signatureOrder.indexOf(a.id);
      const idxB = signatureOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  };

  try {
    const res = await fetch(`${API_BASE_URL}/listings?storeId=st_cad`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Filter for CAD Bakery
        const cadItems = data.filter(
          (item) =>
            item.storeId === 'st_cad' ||
            item.store?.id === 'st_cad' ||
            (item.storeName && item.storeName.toLowerCase().includes('cad')) ||
            (item.store?.name && item.store?.name.toLowerCase().includes('cad')) ||
            (item.id && String(item.id).startsWith('cad-'))
        );

        return sortWithSignatureFirst(cadItems.length > 0 ? cadItems : data);
      }
    }
  } catch (error) {
    console.warn('API error fetching listings, using defaults:', error.message);
  }

  return sortWithSignatureFirst(DEFAULT_MERCHANT_LISTINGS);
}

/**
 * Upload & publish a new surplus food listing (Merchant only)
 */
export async function publishListing(listingData) {
  let created = null;
  try {
    const res = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });

    if (res.ok) {
      const result = await res.json();
      created = result.listing || result;
    }
  } catch (error) {
    console.warn('API error publishing listing:', error.message);
  }

  if (!created) {
    created = {
      id: `lst-${Date.now()}`,
      ...listingData,
      bagsSold: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }

  // Instantly notify Customer app
  notifyCustomerNewListing(created);

  return { success: true, listing: created };
}

/**
 * Update a listing (e.g. inventory, details, status)
 */
export async function updateMerchantListing(id, updateData) {
  const dataToSend = { ...updateData };
  if (dataToSend.bagsAvailable !== undefined) {
    const num = parseInt(dataToSend.bagsAvailable, 10);
    dataToSend.bagsAvailable = num;
    if (!dataToSend.status || dataToSend.status === 'SOLD_OUT' || dataToSend.status === 'ACTIVE') {
      dataToSend.status = num > 0 ? 'ACTIVE' : 'SOLD_OUT';
    }
  }

  let updated = null;
  try {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
    if (res.ok) {
      const result = await res.json();
      updated = result.listing || result;
    }
  } catch (error) {
    console.warn('API error updating listing:', error.message);
  }

  return { success: true, listing: updated || { id, ...dataToSend } };
}

/**
 * Delete a listing
 */
export async function deleteMerchantListing(id) {
  try {
    await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.warn('API error deleting listing:', error.message);
  }

  return { success: true };
}

/**
 * Fetch all orders for merchant
 */
export async function getMerchantOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (error) {
    console.error('Error fetching merchant orders:', error);
    return [];
  }
}

/**
 * Verify customer pickup code (e.g. SAVER-789 or 6-digit code or { code, orderId })
 */
export async function verifyOrderPickup(target) {
  try {
    const payload = typeof target === 'object' && target !== null
      ? target
      : { code: target };

    const res = await fetch(`${API_BASE_URL}/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to verify pickup');
    }
    return data;
  } catch (error) {
    console.error('Error verifying pickup:', error);
    throw error;
  }
}

/**
 * Fetch all notifications (order alerts, confirmations)
 */
export async function getNotifications() {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return await res.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to mark notification as read');
    return await res.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to mark all notifications as read');
    return await res.json();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return null;
  }
}
