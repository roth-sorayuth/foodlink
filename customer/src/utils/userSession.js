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

/**
 * Save isolated active pickup order
 */
export function saveCustomerActiveOrder(userId, order) {
  if (!userId) return;
  try {
    if (order) {
      localStorage.setItem(`${ACTIVE_ORDER_KEY_PREFIX}${userId}`, JSON.stringify(order));
    } else {
      localStorage.removeItem(`${ACTIVE_ORDER_KEY_PREFIX}${userId}`);
    }
  } catch (err) {
    console.warn('Could not save order:', err);
  }
}
