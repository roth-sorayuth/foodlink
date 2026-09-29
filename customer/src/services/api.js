import { io } from 'socket.io-client';

const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000/api' : '');
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (isLocalhost ? 'http://localhost:5000' : '');

// Global Socket.io instance for Customer App (only if SOCKET_URL is available)
export const socket = SOCKET_URL
  ? io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      timeout: 3000,
    })
  : { on: () => {}, off: () => {}, emit: () => {}, connected: false };

if (SOCKET_URL && socket.on) {
  socket.on('connect', () => {
    console.log('[Customer Socket] Connected to FoodLink Backend Gateway:', socket.id);
  });
}

// BroadcastChannel for instant cross-tab / cross-window sync
export const liveDropChannel = typeof window !== 'undefined' && window.BroadcastChannel
  ? new BroadcastChannel('foodlink_live_channel')
  : null;

// Public Cloud Relay Channel (Connects any two devices on Vercel anywhere in the world!)
export const CLOUD_DROPS_TOPIC = 'foodlink_cad_live_drops';

// Default signature listings to ensure full visual richness on initial load and hosted environments
export const DEFAULT_CUSTOMER_LISTINGS = [
  {
    id: 'cad-sourdough-box',
    title: 'Artisan Sourdough & Croissant Surprise Box',
    description: 'European artisan rustic sourdough loaves, buttery croissants, pain au chocolat, and daily fruit danishes.',
    category: 'Pastry',
    photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    originalPrice: 16.00,
    price: 4.99,
    discount: '69% OFF',
    bagsAvailable: 4,
    remaining: 4,
    bagsSold: 20,
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
    },
  },
  {
    id: 'cad-croissant-bundle',
    title: 'French Butter Croissant & Viennoiserie Bag',
    description: 'Pure French butter croissants, almond escargot pastries, chocolate swirls, and buttery brioche buns.',
    category: 'Pastry',
    photoUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
    originalPrice: 13.50,
    price: 3.99,
    discount: '70% OFF',
    bagsAvailable: 5,
    remaining: 5,
    bagsSold: 24,
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
    },
  },
  {
    id: 'cad-rustic-breads',
    title: 'Rustic Country Sourdough & Baguette Pack',
    description: 'Two full-size artisan sourdough boules and crispy European baguettes freshly baked with organic wheat flour.',
    category: 'Pastry',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    originalPrice: 12.00,
    price: 3.50,
    discount: '71% OFF',
    bagsAvailable: 4,
    remaining: 4,
    bagsSold: 16,
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
    },
  },
  {
    id: 'cad-sweet-dessert-box',
    title: 'Sweet Tartlets, Cakes & Danish Treats',
    description: 'Fresh fruit tarts, custard brioches, cinnamon glazed knots, and seasonal pastry slices from today.',
    category: 'Dessert',
    photoUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    originalPrice: 15.00,
    price: 4.50,
    discount: '70% OFF',
    bagsAvailable: 4,
    remaining: 4,
    bagsSold: 16,
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
    },
  },
  {
    id: 'cad-savory-focaccia',
    title: 'Savory Focaccia & Stuffed Brioche Box',
    description: 'Rosemary sea salt focaccia squares, ham and gruyere melt twists, and savory olive rolls.',
    category: 'Food',
    photoUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    originalPrice: 14.00,
    price: 4.20,
    discount: '70% OFF',
    bagsAvailable: 4,
    remaining: 4,
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
    },
  },
  {
    id: 'cad-coffee-pastry-pair',
    title: 'Barista Cold Brew & Afternoon Pastry Pair',
    description: 'Bottled organic cold brew coffee or iced matcha latte paired with two fresh breakfast pastries.',
    category: 'Drinks',
    photoUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    originalPrice: 9.00,
    price: 2.90,
    discount: '68% OFF',
    bagsAvailable: 4,
    remaining: 4,
    bagsSold: 17,
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
    },
  },
  {
    id: 'mori-bistro',
    title: 'Japanese Donburi & Bento Surprise Bag',
    description: 'Fresh teriyaki chicken, katsu curry, or daily sushi roll surplus prepared today.',
    category: 'Asian',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    originalPrice: 3.60,
    price: 1.80,
    discount: '50% OFF',
    bagsAvailable: 3,
    remaining: 3,
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
    },
  },
  {
    id: 'aus-bake',
    title: 'Baking Pastries in Cambodia Since 2003',
    description: 'Assortment of fresh meat pies, sausage rolls, spinach feta parcels and sweet danishes.',
    category: 'Pastry',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=70',
    originalPrice: 5.00,
    price: 2.50,
    discount: '50% OFF',
    bagsAvailable: 5,
    remaining: 5,
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
    },
  },
];

const CUSTOMER_LISTINGS_CACHE_KEY = 'foodlink_customer_cached_listings';
const MERCHANT_CUSTOM_KEY = 'foodlink_merchant_custom_listings';

export function getCachedCustomerListings() {
  try {
    let merchantCustom = [];
    try {
      const mcRaw = localStorage.getItem(MERCHANT_CUSTOM_KEY);
      if (mcRaw) merchantCustom = JSON.parse(mcRaw);
    } catch {}

    const raw = localStorage.getItem(CUSTOMER_LISTINGS_CACHE_KEY);
    let cached = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(cached) || cached.length === 0) {
      cached = [...DEFAULT_CUSTOMER_LISTINGS];
    }

    // Merge merchant custom items from this device
    if (Array.isArray(merchantCustom) && merchantCustom.length > 0) {
      const merged = [...merchantCustom];
      cached.forEach((item) => {
        if (!merged.some((m) => m.id === item.id)) {
          merged.push(item);
        }
      });
      cached = merged;
    }

    return cached;
  } catch {
    return [...DEFAULT_CUSTOMER_LISTINGS];
  }
}

export function saveCachedCustomerListings(listings) {
  if (!Array.isArray(listings)) return;
  try {
    localStorage.setItem(CUSTOMER_LISTINGS_CACHE_KEY, JSON.stringify(listings));
  } catch (err) {
    console.warn('Could not cache customer listings in localStorage:', err);
  }
}

export function getInitialCustomerListings() {
  const items = getCachedCustomerListings();
  return items.sort((a, b) => {
    const qtyA = Number(a.bagsAvailable ?? a.remaining ?? a.remainingCount ?? 0);
    const qtyB = Number(b.bagsAvailable ?? b.remaining ?? b.remainingCount ?? 0);
    return qtyB - qtyA;
  });
}

/**
 * Unified listener that catches new listing drops from:
 * 1. Global Cloud SSE Stream (works on Vercel across separate phones/laptops!)
 * 2. Live Socket.io websocket events
 * 3. Cross-tab BroadcastChannel
 * 4. Cross-tab LocalStorage storage events
 */
export function onNewListingDrop(callback) {
  if (typeof callback !== 'function') return () => {};

  // Track seen event keys to prevent duplicate trigger if received via multiple channels simultaneously
  const seenEvents = new Map();
  const safeCallback = (data) => {
    const notifId = data?.notification?.id;
    const listingId = data?.listing?.id || data?.id;
    const qty = data?.listing?.remaining ?? data?.listing?.bagsAvailable ?? '';
    const isRestock = data?.isRestocked ? 'restock' : 'new';
    const eventKey = notifId || (listingId ? `${listingId}-${qty}-${isRestock}` : null);
    
    const now = Date.now();
    if (eventKey) {
      const lastSeen = seenEvents.get(eventKey);
      if (lastSeen && now - lastSeen < 3000) {
        return; // Deduplicate echoes from multiple channels within 3 seconds
      }
      seenEvents.set(eventKey, now);
      // Clean up old entries
      if (seenEvents.size > 100) {
        for (const [k, ts] of seenEvents.entries()) {
          if (now - ts > 10000) seenEvents.delete(k);
        }
      }
    }

    // Persist new listing into local cache so page refresh never loses it!
    const droppedItem = data?.listing || (data?.id && data?.title ? data : null);
    if (droppedItem && droppedItem.id) {
      try {
        const cached = getCachedCustomerListings();
        const existingIdx = cached.findIndex((c) => c.id === droppedItem.id);
        let updated;
        if (existingIdx !== -1) {
          updated = [...cached];
          updated[existingIdx] = { ...updated[existingIdx], ...droppedItem };
        } else {
          updated = [droppedItem, ...cached];
        }
        saveCachedCustomerListings(updated);
      } catch (err) {}
    }

    callback(data);
  };

  // 1. Global Cloud SSE Stream (Instantly connects customer phones to merchant on Vercel!)
  let eventSource = null;
  try {
    if (typeof window !== 'undefined' && window.EventSource) {
      eventSource = new EventSource(`https://ntfy.sh/${CLOUD_DROPS_TOPIC}/sse`);
      eventSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          const raw = typeof parsed.message === 'string' ? JSON.parse(parsed.message) : (parsed.message || parsed);
          if (raw && (raw.listing || raw.id)) {
            console.log('⚡ [Customer SSE Cloud] Received live listing drop from merchant:', raw);
            safeCallback(raw);
          }
        } catch (err) {
          // Ignore heartbeats or non-JSON pings
        }
      };
    }
  } catch (err) {
    console.warn('[Customer SSE] Init error:', err);
  }

  // 2. Socket.io listener (when local or cloud backend is running)
  const socketHandler = (data) => {
    safeCallback(data);
  };
  if (socket && socket.on) {
    socket.on('NEW_LISTING', socketHandler);
  }

  // 3. BroadcastChannel listener (same-origin browser tabs)
  let channelHandler = null;
  if (liveDropChannel) {
    channelHandler = (event) => {
      if (event.data?.type === 'NEW_LISTING' && event.data?.data) {
        safeCallback(event.data.data);
      }
    };
    liveDropChannel.addEventListener('message', channelHandler);
  }

  // 4. LocalStorage storage event listener (cross-tab fallback)
  const storageHandler = (e) => {
    if (e.key === 'foodlink_last_new_listing' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && parsed.listing) {
          safeCallback(parsed);
        }
      } catch (err) {}
    }
  };
  window.addEventListener('storage', storageHandler);

  // Unsubscribe cleanup function
  return () => {
    if (eventSource) {
      eventSource.close();
    }
    if (socket && socket.off) {
      socket.off('NEW_LISTING', socketHandler);
    }
    if (liveDropChannel && channelHandler) {
      liveDropChannel.removeEventListener('message', channelHandler);
    }
    window.removeEventListener('storage', storageHandler);
  };
}

/**
 * Fetch all active listings from the backend database or cloud live drops with local cache fallback
 */
export async function getActiveListings(category = 'all', search = '') {
  let combinedListings = getCachedCustomerListings();

  // 1. Fetch real listings from backend database if API_BASE_URL is reachable
  if (API_BASE_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE_URL}/listings?${params.toString()}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const backendData = await res.json();
        if (Array.isArray(backendData) && backendData.length > 0) {
          // Merge backend listings with base listings, prioritizing backend data
          const merged = [...backendData];
          combinedListings.forEach((baseItem) => {
            if (!merged.some((b) => b.id === baseItem.id)) {
              merged.push(baseItem);
            }
          });
          combinedListings = merged;
        }
      }
    } catch (error) {
      console.warn('API listings fetch skipped or timed out, relying on cloud sync and cached listings:', error);
    }
  }

  // 2. Poll public Cloud topic for any live drops published across devices on Vercel
  try {
    const cloudController = new AbortController();
    const cloudTimeout = setTimeout(() => cloudController.abort(), 2500);
    const cloudRes = await fetch(`https://ntfy.sh/${CLOUD_DROPS_TOPIC}/json?poll=1`, { signal: cloudController.signal });
    clearTimeout(cloudTimeout);
    if (cloudRes.ok) {
      const text = await cloudRes.text();
      const lines = text.trim().split('\n');
      const cloudItems = [];
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          const rawMsg = typeof parsed.message === 'string' ? JSON.parse(parsed.message) : (parsed.message || parsed);
          const item = rawMsg?.listing || rawMsg;
          if (item && item.id && !cloudItems.some((c) => c.id === item.id)) {
            cloudItems.push(item);
          }
        } catch {}
      }
      if (cloudItems.length > 0) {
        const mergedWithCloud = [...cloudItems.reverse()];
        combinedListings.forEach((c) => {
          if (!mergedWithCloud.some((item) => item.id === c.id)) {
            mergedWithCloud.push(c);
          }
        });
        combinedListings = mergedWithCloud;
      }
    }
  } catch (cloudErr) {
    // Ignore network error
  }

  // 3. Fallback check: if somehow combinedListings is empty, use defaults
  if (!Array.isArray(combinedListings) || combinedListings.length === 0) {
    combinedListings = [...DEFAULT_CUSTOMER_LISTINGS];
  }

  // 4. Save refreshed list to localStorage
  saveCachedCustomerListings(combinedListings);

  // 5. Apply filtering if category or search query was specified
  let results = [...combinedListings];
  if (category && category !== 'all') {
    const catLower = category.toLowerCase();
    results = results.filter((item) => {
      const itemCat = (item.category || '').toLowerCase();
      const itemTitle = (item.title || '').toLowerCase();
      return (
        itemCat === catLower ||
        itemCat.includes(catLower) ||
        (catLower === 'pastry' && (itemCat.includes('bak') || itemTitle.includes('pastry') || itemTitle.includes('bread') || itemTitle.includes('croissant'))) ||
        (catLower === 'food' && (itemCat.includes('meal') || itemCat.includes('food') || itemCat.includes('bento'))) ||
        (catLower === 'asian' && (itemTitle.includes('donburi') || itemTitle.includes('bento') || itemCat.includes('asian') || itemCat.includes('japanese')))
      );
    });
  }

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter((item) => {
      return (
        (item.storeName || item.store?.name || item.store || '').toLowerCase().includes(q) ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.address || item.store?.address || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q)
      );
    });
  }

  return results.sort((a, b) => {
    const qtyA = Number(a.bagsAvailable ?? a.remaining ?? a.remainingCount ?? 0);
    const qtyB = Number(b.bagsAvailable ?? b.remaining ?? b.remainingCount ?? 0);
    return qtyB - qtyA;
  });
}

/**
 * Place order / reserve one or multiple surplus bags (Customer only)
 */
export async function reserveListing(target, maybeQuantity = 1, maybeUser = {}) {
  try {
    let payload = {};

    // Support both reserveListing({ items, user }) and reserveListing(listingId, quantity, user)
    if (typeof target === 'object' && target !== null && !target.id) {
      const { listingId, items = [], quantity = 1, user = {} } = target;
      payload.userId = user.id;
      payload.customerName = user.name;
      payload.customerEmail = user.email;
      payload.avatarUrl = user.avatar;

      if (Array.isArray(items) && items.length > 0) {
        payload.items = items.map((it) => ({
          listingId: it.listing?.id || it.listingId || it.id,
          quantity: it.quantity || 1,
          title: it.listing?.title || it.title,
          price: typeof it.listing?.price === 'number' ? it.listing.price : parseFloat(String(it.listing?.price || '4.99').replace(/[^0-9.]/g, '')) || 4.99,
          photoUrl: it.listing?.image || it.photoUrl,
        }));
      } else if (listingId) {
        payload.listingId = listingId;
        payload.quantity = quantity;
      }
    } else {
      const listingId = typeof target === 'object' ? target.id : target;
      const user = maybeUser || {};
      payload = {
        listingId,
        quantity: maybeQuantity || 1,
        userId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        avatarUrl: user.avatar,
      };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to place order');
      }
      return await res.json();
    } catch (fetchErr) {
      console.warn('[Customer API] Backend unreachable, generating instant demo pickup pass:', fetchErr);
      const pickupDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
      const orderNumber = `#FS-${pickupDigits}`;
      const fallbackItems = Array.isArray(payload.items) && payload.items.length > 0
        ? payload.items
        : [{
            listingId: payload.listingId || 'cad-sourdough-box',
            quantity: payload.quantity || 1,
            title: 'Artisan Sourdough & Croissant Surprise Box',
            price: 4.99,
            photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=360&q=60',
          }];
      const totalPrice = fallbackItems.reduce((sum, it) => sum + ((it.price || 4.99) * (it.quantity || 1)), 0).toFixed(2);

      const demoOrder = {
        id: `ord_${Date.now()}`,
        orderNumber,
        pickupCode: pickupDigits,
        digits: pickupDigits.split(''),
        status: 'PENDING',
        customerName: payload.customerName || 'Demo Customer',
        customerEmail: payload.customerEmail || 'customer@foodlink.com',
        avatarUrl: payload.avatarUrl,
        items: fallbackItems,
        totalPrice,
        createdAt: new Date().toISOString(),
      };
      return { success: true, order: demoOrder };
    }
  } catch (error) {
    console.error('Error reserving listing:', error);
    throw error;
  }
}

/**
 * Fetch customer orders from server
 */
export async function getCustomerOrders(userId) {
  if (!API_BASE_URL) return [];
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    const res = await fetch(`${API_BASE_URL}/orders?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch customer orders');
    return await res.json();
  } catch (error) {
    console.warn('Error fetching customer orders:', error);
    return [];
  }
}

/**
 * Fetch customer notifications
 */
export async function getNotifications() {
  if (!API_BASE_URL) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/notifications?type=NEW_LISTING&role=customer`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const data = await res.json();
    return Array.isArray(data)
      ? data.filter(
          (n) =>
            n &&
            n.type === 'NEW_LISTING' &&
            !n.title?.toLowerCase().includes('order') &&
            !n.title?.toLowerCase().includes('pickup') &&
            !n.title?.toLowerCase().includes('claim') &&
            !n.message?.toLowerCase().includes('claimed') &&
            !n.message?.toLowerCase().includes('verified')
        )
      : [];
  } catch (error) {
    console.warn('Error fetching notifications:', error);
    return [];
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id) {
  if (!API_BASE_URL) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to mark notification as read');
    return await res.json();
  } catch (error) {
    console.warn('Error marking notification as read:', error);
    return null;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  if (!API_BASE_URL) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to mark all notifications as read');
    return await res.json();
  } catch (error) {
    console.warn('Error marking all notifications as read:', error);
    return null;
  }
}

/**
 * Play pleasant synthesizer chime on real-time alerts
 */
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(659.25, now); // E5 note
    osc.frequency.setValueAtTime(987.77, now + 0.12); // B5 note

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch {
    // Autoplay restrictions or unsupported audio context
  }
}
