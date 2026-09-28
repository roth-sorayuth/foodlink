/**
 * FoodLink Customer Isolation & Multi-Item Cart Session Manager
 * Ensures that each device scanning the QR code gets an isolated session:
 * - Unique user ID and demo persona (e.g. Sreypov K., Dara Sok, etc.)
 * - Isolated multi-item bag/cart
 * - Isolated active pickup passes & orders
 */

const USER_KEY = 'foodlink_customer_user_v2';
const CART_KEY_PREFIX = 'foodlink_cart_';
const ACTIVE_ORDER_KEY_PREFIX = 'foodlink_active_order_';

const DEMO_PERSONAS = [
  { name: 'Sreypov K.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=70' },
  { name: 'Dara Sok', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=70' },
  { name: 'Bopha Tep', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=70' },
  { name: 'Alex Morison', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=70' },
  { name: 'Channary Heng', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=70' },
  { name: 'Vannak Leng', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=70' },
];

/**
 * Gets or creates an isolated customer user identity on this browser
 */
export function getOrCreateCustomerUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) return parsed;
    }
  } catch (err) {
    console.warn('Could not read user from storage:', err);
  }

  // Create new unique isolated user
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const persona = DEMO_PERSONAS[Math.floor(Math.random() * DEMO_PERSONAS.length)];
  const userId = `cust-${Date.now().toString(36)}-${randomSuffix}`;

  const newUser = {
    id: userId,
    name: persona.name,
    email: `${userId}@foodlink.demo`,
    avatar: persona.avatar,
    role: 'CUSTOMER',
    savedKg: '14.2 kg',
    mealsRescued: 3,
  };

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  } catch (err) {
    console.warn('Could not write user to storage:', err);
  }

  return newUser;
}

/**
 * Get isolated cart for user
 */
export function getCustomerCart(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${CART_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save isolated cart for user
 */
export function saveCustomerCart(userId, cart) {
  if (!userId) return;
  try {
    localStorage.setItem(`${CART_KEY_PREFIX}${userId}`, JSON.stringify(cart || []));
  } catch (err) {
    console.warn('Could not save cart:', err);
  }
}

/**
 * Get isolated active pickup order
 */
export function getCustomerActiveOrder(userId) {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(`${ACTIVE_ORDER_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ORDER_HISTORY_KEY_PREFIX = 'foodlink_order_history_';

/**
 * Save isolated active pickup order
 */
export function saveCustomerActiveOrder(userId, order) {
  if (!userId) return;
  try {
    if (order) {
      localStorage.setItem(`${ACTIVE_ORDER_KEY_PREFIX}${userId}`, JSON.stringify(order));
      recordCustomerOrder(userId, order);
    } else {
      localStorage.removeItem(`${ACTIVE_ORDER_KEY_PREFIX}${userId}`);
    }
  } catch (err) {
    console.warn('Could not save order:', err);
  }
}

/**
 * Get customer's full reservation history (past and active)
 */
export function getCustomerOrderHistory(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${ORDER_HISTORY_KEY_PREFIX}${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read order history:', err);
  }

  // Sample default past reserves for demo customer
  return [
    {
      id: 'FS-hist-1',
      orderNumber: '#FS-42302',
      pickupCode: '423023',
      storeName: 'CAD Bakery',
      storeAddress: '422 St 178, Daun Penh, Phnom Penh',
      items: [
        {
          title: 'Artisan Pastry & Sourdough Surprise Bag',
          quantity: 1,
          price: 4.99,
          originalPrice: 16.00,
          photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=70',
        }
      ],
      totalPrice: 4.99,
      totalSaved: 11.01,
      co2SavedKg: 1.8,
      status: 'COMPLETED',
      pickupDate: 'Earlier Today',
      pickupWindow: '12:30 PM – 1:30 PM',
      completedAt: 'Today, 12:40 PM',
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    },
    {
      id: 'FS-hist-2',
      orderNumber: '#FS-87910',
      pickupCode: '879104',
      storeName: 'CAD Bakery',
      storeAddress: '422 St 178, Daun Penh, Phnom Penh',
      items: [
        {
          title: 'Sweet Tartlets & Danish Treats Box',
          quantity: 1,
          price: 4.50,
          originalPrice: 15.00,
          photoUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=70',
        }
      ],
      totalPrice: 4.50,
      totalSaved: 10.50,
      co2SavedKg: 2.1,
      status: 'COMPLETED',
      pickupDate: 'Yesterday',
      pickupWindow: '7:00 PM – 8:30 PM',
      completedAt: 'Yesterday, 7:45 PM',
      createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
    }
  ];
}

/**
 * Record a new or updated reservation in history
 */
export function recordCustomerOrder(userId, order) {
  if (!userId || !order) return;
  try {
    const history = getCustomerOrderHistory(userId);
    const existingIdx = history.findIndex((h) => 
      (h.id && order.id && h.id === order.id) || 
      (h.orderNumber && order.orderNumber && h.orderNumber === order.orderNumber) ||
      (h.pickupCode && order.pickupCode && h.pickupCode === order.pickupCode)
    );

    let updated;
    if (existingIdx !== -1) {
      updated = [...history];
      updated[existingIdx] = { ...updated[existingIdx], ...order };
    } else {
      updated = [{ ...order, createdAt: order.createdAt || new Date().toISOString() }, ...history];
    }

    localStorage.setItem(`${ORDER_HISTORY_KEY_PREFIX}${userId}`, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not record order in history:', err);
  }
}

/**
 * Mark order as completed in history
 */
export function markOrderCompletedInHistory(userId, codeOrId) {
  if (!userId || !codeOrId) return;
  try {
    const history = getCustomerOrderHistory(userId);
    const updated = history.map((o) => {
      const match = o.id === codeOrId || o.pickupCode === codeOrId || o.orderNumber === codeOrId;
      if (match) {
        return {
          ...o,
          status: 'COMPLETED',
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return o;
    });
    localStorage.setItem(`${ORDER_HISTORY_KEY_PREFIX}${userId}`, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not update order status in history:', err);
  }
}
