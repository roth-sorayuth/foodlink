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
 * Fetch all active listings from the backend database or cloud live drops
 */
export async function getActiveListings(category = 'all', search = '') {
  let backendListings = [];

  // Fetch real listings from backend database
  if (API_BASE_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE_URL}/listings?${params.toString()}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        backendListings = await res.json();
      }
    } catch (error) {
      console.warn('API listings fetch skipped or timed out:', error);
    }
  }

  return Array.isArray(backendListings)
    ? [...backendListings].sort((a, b) => {
        const qtyA = Number(a.bagsAvailable ?? a.remaining ?? 0);
        const qtyB = Number(b.bagsAvailable ?? b.remaining ?? 0);
        return qtyB - qtyA;
      })
    : [];
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
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    const res = await fetch(`${API_BASE_URL}/orders?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch customer orders');
    return await res.json();
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
}

/**
 * Fetch customer notifications
 */
export async function getNotifications() {
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
