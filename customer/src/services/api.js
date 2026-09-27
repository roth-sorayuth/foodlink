import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Global Socket.io instance for Customer App
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('[Customer Socket] Connected to FoodLink Backend Gateway:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[Customer Socket] Disconnected from Backend Gateway');
});

/**
 * Fetch all active listings from the backend database
 */
export async function getActiveListings(category = 'all', search = '') {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE_URL}/listings?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch listings');
    return await res.json();
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

/**
 * Place order / reserve a surplus bag (Customer only)
 */
export async function reserveListing(listingId, quantity = 1) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, quantity }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }
    return await res.json();
  } catch (error) {
    console.error('Error reserving listing:', error);
    throw error;
  }
}

/**
 * Fetch customer notifications
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
