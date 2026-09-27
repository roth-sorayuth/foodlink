const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all listings for merchant
 */
export async function getMerchantListings() {
  try {
    const res = await fetch(`${API_BASE_URL}/listings`);
    if (!res.ok) throw new Error('Failed to fetch listings');
    return await res.json();
  } catch (error) {
    console.error('Error fetching merchant listings:', error);
    return [];
  }
}

/**
 * Upload & publish a new surplus food listing (Merchant only)
 */
export async function publishListing(listingData) {
  try {
    const res = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to publish listing');
    }

    return await res.json();
  } catch (error) {
    console.error('Error publishing listing:', error);
    throw error;
  }
}

/**
 * Update a listing (e.g. inventory, status)
 */
export async function updateMerchantListing(id, updateData) {
  try {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error('Failed to update listing');
    return await res.json();
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
}

/**
 * Delete a listing
 */
export async function deleteMerchantListing(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete listing');
    return await res.json();
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
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
 * Verify customer pickup code (e.g. SAVER-789)
 */
export async function verifyOrderPickup(code) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
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
