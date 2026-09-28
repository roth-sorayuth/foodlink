import { io } from 'socket.io-client';

const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000/api' : '');
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (isLocalhost ? 'http://localhost:5000' : '');

// Global Socket.io instance for Merchant App (only if SOCKET_URL is available)
export const socket = SOCKET_URL
  ? io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      timeout: 3000,
    })
  : { on: () => {}, off: () => {}, emit: () => {}, connected: false };

if (SOCKET_URL && socket.on) {
  socket.on('connect', () => {
    console.log('[Merchant Socket] Connected to FoodLink Gateway:', socket.id);
  });
}

// BroadcastChannel for instant cross-tab / cross-window sync
const liveDropChannel = typeof window !== 'undefined' && window.BroadcastChannel
  ? new BroadcastChannel('foodlink_live_channel')
  : null;

// Public Cloud Relay Channel (Connects any two devices on Vercel anywhere in the world!)
export const CLOUD_DROPS_TOPIC = 'foodlink_cad_live_drops';

/**
 * Broadcast new listing to Customer app via:
 * 1. Global Cloud Pub/Sub (works on Vercel across separate phones/laptops!)
 * 2. Socket.io (when local backend or cloud backend is running)
 * 3. BroadcastChannel (same-origin browser tabs)
 * 4. LocalStorage (cross-tab fallback)
 */
export function notifyCustomerNewListing(listing, isRestock = false) {
  if (!listing) return;
  const priceNum = typeof listing.price === 'number'
    ? listing.price
    : parseFloat(String(listing.price || '4.99').replace(/[^0-9.]/g, '')) || 4.99;
  
  const bags = listing.remaining !== undefined ? listing.remaining : (listing.bagsAvailable || 1);
  const store = listing.storeName || 'CAD Bakery';
  const title = isRestock ? 'Surplus Food Restocked! 🔥' : 'New Surplus Food Available!';
  const message = isRestock
    ? `${store} just restocked "${listing.title}"! (${bags} available for $${priceNum.toFixed(2)})`
    : `${store} just listed "${listing.title}" for $${priceNum.toFixed(2)}`;

  const payload = {
    isRestocked: isRestock,
    listing: {
      ...listing,
      price: priceNum,
      storeName: store,
      bagsAvailable: bags,
      remaining: bags,
    },
    notification: {
      id: `notif-${listing.id || Date.now()}`,
      type: 'NEW_LISTING',
      title,
      message,
      listingId: listing.id,
      listing: {
        ...listing,
        price: priceNum,
        storeName: store,
        bagsAvailable: bags,
        remaining: bags,
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  };

  // 1. Global Cloud Broadcast (Instantly reaches customer phones on Vercel via SSE!)
  try {
    fetch(`https://ntfy.sh/${CLOUD_DROPS_TOPIC}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.warn('[Cloud Broadcast] ntfy push error:', err));
  } catch (err) {
    // Ignore network error
  }

  // 2. Emit to WebSocket server if running
  try {
    if (socket && socket.connected) {
      socket.emit('NEW_LISTING_DROPPED', payload);
    }
  } catch (err) {
    console.warn('[Merchant Socket] emit failed:', err);
  }

  // 3. BroadcastChannel for instant same-origin tab sync
  try {
    if (liveDropChannel) {
      liveDropChannel.postMessage({ type: 'NEW_LISTING', data: payload });
    }
  } catch (err) {
    console.warn('[Merchant BroadcastChannel] postMessage failed:', err);
  }

  // 4. LocalStorage storage event fallback across tabs
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

// Local persistent storage key for merchant-created/updated items
const MERCHANT_LISTINGS_STORAGE_KEY = 'foodlink_merchant_custom_listings';

export function getCustomMerchantListings() {
  try {
    const raw = localStorage.getItem(MERCHANT_LISTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomMerchantListing(item) {
  if (!item || !item.id) return;
  try {
    const current = getCustomMerchantListings();
    const filtered = current.filter((l) => l.id !== item.id);
    const updated = [item, ...filtered];
    localStorage.setItem(MERCHANT_LISTINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save custom listing locally:', err);
  }
}

export function removeCustomMerchantListing(id) {
  try {
    const current = getCustomMerchantListings();
    const updated = current.filter((l) => l.id !== id);
    localStorage.setItem(MERCHANT_LISTINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not delete custom listing locally:', err);
  }
}

/**
 * Fetch all listings for merchant directly from backend database or local storage
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

  const customItems = getCustomMerchantListings();
  let baseListings = DEFAULT_MERCHANT_LISTINGS;

  // 1. Fetch real listings directly from backend database if available
  if (API_BASE_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${API_BASE_URL}/listings?storeId=st_cad`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const dbListings = data.filter(
            (item) =>
              item.storeId === 'st_cad' ||
              item.store?.id === 'st_cad' ||
              (item.storeName && item.storeName.toLowerCase().includes('cad')) ||
              (item.store?.name && item.store?.name.toLowerCase().includes('cad')) ||
              (item.id && String(item.id).startsWith('cad-'))
          );
          if (dbListings.length > 0) {
            return dbListings.sort((a, b) => {
              const idxA = signatureOrder.indexOf(a.id);
              const idxB = signatureOrder.indexOf(b.id);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              if (idxA !== -1) return -1;
              if (idxB !== -1) return 1;
              return 0;
            });
          }
        }
      }
    } catch (error) {
      console.warn('API fetch skipped or timed out, using fallback data');
    }
  }

  // Combine custom items with base items fallback
  const allMap = new Map();
  customItems.forEach((it) => allMap.set(it.id, it));
  baseListings.forEach((it) => {
    if (!allMap.has(it.id)) allMap.set(it.id, it);
  });

  const combined = Array.from(allMap.values());

  // Sort so newly created items appear at the VERY TOP, followed by signature items
  return combined.sort((a, b) => {
    const aIsCustom = customItems.some((c) => c.id === a.id);
    const bIsCustom = customItems.some((c) => c.id === b.id);
    if (aIsCustom && !bIsCustom) return -1;
    if (!aIsCustom && bIsCustom) return 1;

    const idxA = signatureOrder.indexOf(a.id);
    const idxB = signatureOrder.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });
}

/**
 * Upload & publish a new surplus food listing (Merchant only)
 */
export async function publishListing(listingData) {
  let created = null;

  if (API_BASE_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`${API_BASE_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const result = await res.json();
        created = result.listing || result;
      }
    } catch (error) {
      console.warn('API error publishing listing, falling back to instant cloud sync:', error.message);
    }
  }

  if (!created) {
    created = {
      id: `cad-item-${Date.now()}`,
      ...listingData,
      bagsSold: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }

  // Save to persistent custom merchant storage & prepend to DEFAULT_MERCHANT_LISTINGS
  saveCustomMerchantListing(created);
  const exists = DEFAULT_MERCHANT_LISTINGS.some((l) => l.id === created.id);
  if (!exists) {
    DEFAULT_MERCHANT_LISTINGS.unshift(created);
  }

  // Instantly notify Customer app across cloud and local
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

  const finalUpdated = updated || { id, ...dataToSend };
  saveCustomMerchantListing(finalUpdated);
  const defIdx = DEFAULT_MERCHANT_LISTINGS.findIndex((l) => l.id === id);
  if (defIdx !== -1) {
    DEFAULT_MERCHANT_LISTINGS[defIdx] = { ...DEFAULT_MERCHANT_LISTINGS[defIdx], ...dataToSend };
  }

  return { success: true, listing: finalUpdated };
}

/**
 * Delete a listing
 */
export async function deleteMerchantListing(id) {
  removeCustomMerchantListing(id);
  const defIdx = DEFAULT_MERCHANT_LISTINGS.findIndex((l) => l.id === id);
  if (defIdx !== -1) {
    DEFAULT_MERCHANT_LISTINGS.splice(defIdx, 1);
  }

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
 * Look up order details by 6-digit pickup code
 */
export async function lookupOrder(code) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/lookup?code=${encodeURIComponent(code)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Order not found');
    }
    const data = await res.json();
    return data.order || data;
  } catch (error) {
    console.error('Error looking up order:', error);
    throw error;
  }
}

/**
 * Place a real customer order directly into the database
 */
export async function createRealOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create order');
    }
    return await res.json();
  } catch (error) {
    console.error('Error creating real order:', error);
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
