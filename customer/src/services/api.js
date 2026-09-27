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
