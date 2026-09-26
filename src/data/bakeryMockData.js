// Bakery Detail Mock Data tailored for Cambodian Foodlink platform
// Store: Brown Coffee & Bakery (Toul Kork Hub, Phnom Penh)

export const BROWN_COFFEE_BAKERY_DATA = {
  id: 'brown-coffee-tk',
  name: 'Brown Coffee & Bakery',
  verified: true,
  category: 'Pastries, Specialty Coffee & Artisan Breads',
  rating: 4.9,
  reviewsCount: 428,
  distance: '400m from RUPP Gate 2',
  status: 'Pickup Ready',
  mealsRescuedCount: '340+ meals rescued',
  closingTimeText: 'Closes 8:30 PM',
  hubBadge: 'TK Hub',
  studentPartnerText: 'Student Verified Partner • Bring cup for -10% bonus',
  
  // Hero Bakery Interior Image
  heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=85',
  
  // Notice Banner
  availabilityNotice: {
    title: 'Available Today (2 Bags Left)',
    pickupWindow: 'Pickup Window: Today 18:00 - 20:00 (Starts in 42m)',
    totalBagsLeft: 2,
  },

  // Surplus Packages
  surplusPackages: [
    {
      id: 'pkg-1',
      tag: 'SURPLUS MYSTERY BAG',
      tagVariant: 'amber', // amber pill with lightning icon
      title: 'Assorted Fresh Pastry & Donut Bag',
      description: 'Chef selection of artisanal croissants, cinnamon swirl, almond danish, or glazed treats.',
      price: 2.50,
      originalPrice: 6.00,
      discountPercent: '-58%',
      khrPrice: '10,250 KHR',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      stockLeft: 2,
      stockBadge: '2 left',
      isSoldOut: false,
      hasStepper: true,
      initialQuantity: 1,
    },
    {
      id: 'pkg-2',
      tag: 'SAVORY DELIGHTS',
      tagVariant: 'mint', // light green/mint pill
      title: 'Gourmet Ciabatta & Quiche Box',
      description: 'Smoked ham & cheese panini, warm spinach quiche slices, or fresh pesto...',
      price: 3.00,
      originalPrice: 7.00,
      discountPercent: '-57%',
      khrPrice: '12,300 KHR',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
      stockLeft: 1,
      stockBadge: '1 left',
      isSoldOut: false,
      hasStepper: false,
      initialQuantity: 0,
    },
    {
      id: 'pkg-3',
      tag: 'SOLD OUT TODAY',
      tagVariant: 'gray', // muted pill
      title: 'Cold Brew & Sponge Slice Combo',
      description: 'Signature slow-drip bottle with slice of...',
      price: 2.80,
      originalPrice: 6.20,
      discountPercent: '-55%',
      khrPrice: '11,480 KHR',
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
      stockLeft: 0,
      isSoldOut: true,
      soldOutInfo: 'All 4 bags rescued at 17:15',
    },
  ],

  // Pickup Protocol
  pickupProtocol: {
    hubLocation: 'Toul Kork Hub',
    steps: [
      {
        stepNumber: 1,
        title: 'Reserve via Bakong KHQR',
        description: 'Instant zero-fee scan lock. Your bundle is held securely.',
      },
      {
        stepNumber: 2,
        title: 'Arrive between 18:00 – 20:00',
        description: 'Head straight to the pickup counter & show your in-app QR.',
      },
      {
        stepNumber: 3,
        isEco: true,
        title: 'Bring Your Own Container',
        description: 'Earn +15 Eco-Karma points and reduce single-use plastic waste.',
      },
    ],
  },

  // Store Location
  locationInfo: {
    hubName: 'Brown Coffee Toul Kork',
    badge: 'Open until 20:30',
    addressLine1: 'Corner St. 598 & St. 315, Toul Kork',
    addressLine2: 'Near RUPP & IFL Campus, Phnom Penh',
    phone: '+855 23 888 123',
    directionsUrl: 'https://maps.google.com/?q=Brown+Coffee+Toul+Kork+Phnom+Penh',
  },

  // Community Notes
  communityNotes: {
    rating: 4.9,
    totalReviews: 428,
    reviews: [
      {
        id: 'rev-1',
        name: 'Sophea Leng',
        avatarBg: 'bg-emerald-100 text-emerald-800',
        initials: 'SL',
        studentBadge: 'RUPP Computer Science • Rescued 14 meals',
        timeAgo: 'Yesterday',
        content:
          '"The pastry mystery bag was legendary! Got two almond croissants and a chocolate twist. Tasted just as crisp when reheated in my dorm toaster oven."',
      },
      {
        id: 'rev-2',
        name: 'Dara Roth',
        avatarBg: 'bg-amber-100 text-amber-900',
        initials: 'DR',
        studentBadge: 'IFL Student • Rescued 6 meals',
        timeAgo: '2d ago',
        content:
          '"Friendly baristas, zero awkwardness claiming the surplus pass. Quick KHQR checkout and pickup took under 45 seconds!"',
      },
      {
        id: 'rev-3',
        name: 'Vannak Kem',
        avatarBg: 'bg-teal-100 text-teal-900',
        initials: 'VK',
        studentBadge: 'CADT Student • Rescued 9 meals',
        timeAgo: '3d ago',
        content:
          '"Such a smart way to get high-grade artisan bread on a student budget. Fresh, crunchy, and zero waste."',
      },
    ],
  },
};
