const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DEFAULT_MERCHANT_LISTINGS = [
  {
    id: 'cad-surprise-sourdough',
    title: 'Artisan Pastry & Sourdough Surprise Bag',
    description: "Assortment of today's fresh unsold sourdough loaves, flaky croissants, and daily brioche buns. 100% fresh surplus.",
    category: 'bakery',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    originalPrice: 16.00,
    price: 4.99,
    discount: '69% OFF',
    bagsAvailable: 5,
    bagsSold: 7,
    status: 'ACTIVE',
    pickupDate: 'Today',
    pickupStart: '6:30 PM',
    pickupEnd: '7:30 PM',
    dietaryTags: ['vegetarian'],
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
 * Fetch all listings for merchant (with offline & localStorage fallback)
 */
export async function getMerchantListings() {
  try {
    const res = await fetch(`${API_BASE_URL}/listings`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        try {
          localStorage.setItem('foodlink_merchant_listings', JSON.stringify(data));
        } catch (e) {}
        return data;
      }
    }
  } catch (error) {
    console.warn('API error fetching listings, falling back to local cache/defaults:', error.message);
  }

  // Fallback to localStorage or default seed listings
  try {
    const cached = localStorage.getItem('foodlink_merchant_listings');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  return DEFAULT_MERCHANT_LISTINGS;
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
    console.warn('API error publishing listing, storing locally:', error.message);
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

  try {
    const cached = JSON.parse(localStorage.getItem('foodlink_merchant_listings') || JSON.stringify(DEFAULT_MERCHANT_LISTINGS));
    const updated = [created, ...cached.filter((l) => l.id !== created.id)];
    localStorage.setItem('foodlink_merchant_listings', JSON.stringify(updated));
  } catch (e) {}

  return { success: true, listing: created };
}

/**
 * Update a listing (e.g. inventory, details, status)
 */
export async function updateMerchantListing(id, updateData) {
  let updated = null;
  try {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (res.ok) {
      const result = await res.json();
      updated = result.listing || result;
    }
  } catch (error) {
    console.warn('API error updating listing, updating locally:', error.message);
  }

  try {
    const cached = JSON.parse(localStorage.getItem('foodlink_merchant_listings') || JSON.stringify(DEFAULT_MERCHANT_LISTINGS));
    const idx = cached.findIndex((l) => l.id === id);
    if (idx !== -1) {
      cached[idx] = { ...cached[idx], ...updateData };
      updated = cached[idx];
    } else {
      updated = { id, ...updateData };
      cached.unshift(updated);
    }
    localStorage.setItem('foodlink_merchant_listings', JSON.stringify(cached));
  } catch (e) {}

  return { success: true, listing: updated || { id, ...updateData } };
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
    console.warn('API error deleting listing, deleting locally:', error.message);
  }

  try {
    const cached = JSON.parse(localStorage.getItem('foodlink_merchant_listings') || JSON.stringify(DEFAULT_MERCHANT_LISTINGS));
    const filtered = cached.filter((l) => l.id !== id);
    localStorage.setItem('foodlink_merchant_listings', JSON.stringify(filtered));
  } catch (e) {}

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
