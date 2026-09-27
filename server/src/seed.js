import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FoodLink database seed...');

  // 1. Create Demo Users
  const merchantUser = await prisma.user.upsert({
    where: { email: 'merchant@artisanbakery.com' },
    update: {},
    create: {
      email: 'merchant@artisanbakery.com',
      name: 'Marcus Vance',
      role: 'MERCHANT',
      phone: '+1 (415) 890-1234',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'sarah.jenkins@foodlink.org' },
    update: {},
    create: {
      email: 'sarah.jenkins@foodlink.org',
      name: 'Sarah Jenkins',
      role: 'CUSTOMER',
      phone: '+1 (415) 555-0192',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      mealsRescued: 14,
      co2SavedKg: 28.5,
      moneySaved: 94.5,
      radarRadius: 2.0,
      dietaryPreferences: ['Vegetarian', 'Nut-Free Alert'],
    },
  });

  // 2. Create Stores
  const bakeryStore = await prisma.store.upsert({
    where: { id: 'store-gg-bakery' },
    update: {},
    create: {
      id: 'store-gg-bakery',
      name: 'Golden Gate Bakery & Cafe',
      description: 'Artisanal daily sourdough loaves, viennoiserie, and organic espresso treats made fresh every morning.',
      category: 'Bakery & Cafe',
      address: '422 Mission St, San Francisco, CA 94105',
      rating: 4.9,
      reviewCount: '340+',
      distance: '0.4 mi',
      logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      ownerId: merchantUser.id,
      acceptingOrders: true,
    },
  });

  const grocerStore = await prisma.store.upsert({
    where: { id: 'store-green-earth' },
    update: {},
    create: {
      id: 'store-green-earth',
      name: 'Green Earth Organic Grocers',
      description: 'Local and zero-waste grocery specializing in seasonal organic fruits, crisp greens, and artisanal cheeses.',
      category: 'Groceries',
      address: '890 Market St, San Francisco, CA 94102',
      rating: 4.8,
      reviewCount: '190+',
      distance: '0.8 mi',
      logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80',
      acceptingOrders: true,
    },
  });

  const tokyoKitchen = await prisma.store.upsert({
    where: { id: 'store-tokyo-kitchen' },
    update: {},
    create: {
      id: 'store-tokyo-kitchen',
      name: 'Tokyo Kitchen Express',
      description: 'Authentic Japanese daily bentos, hot donburi bowls, fresh sushi rolls, and miso broth.',
      category: 'Meals',
      address: '1050 Folsom St, San Francisco, CA 94103',
      rating: 4.7,
      reviewCount: '420+',
      distance: '1.1 mi',
      logoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80',
      acceptingOrders: true,
    },
  });

  // 3. Create Initial Listings
  await prisma.listing.createMany({
    data: [
      {
        id: 'lst-bakery-pastry',
        storeId: bakeryStore.id,
        storeName: bakeryStore.name,
        title: 'Artisan Pastry & Sourdough Surprise Bag',
        description: "Assortment of today's fresh unsold sourdough loaves, flaky croissants, and daily brioche buns. 100% fresh and edible surplus.",
        category: 'baked',
        photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
        originalPrice: 16.0,
        price: 4.99,
        discount: '69% OFF',
        bagsAvailable: 6,
        bagsSold: 4,
        status: 'ACTIVE',
        pickupDate: 'Today',
        pickupStart: '6:30 PM',
        pickupEnd: '7:30 PM',
        dietaryTags: ['Vegetarian'],
        co2SavedKg: 1.8,
      },
      {
        id: 'lst-groceries-box',
        storeId: grocerStore.id,
        storeName: grocerStore.name,
        title: 'Fresh Organic Produce & Dairy Box',
        description: 'Assortment of seasonal organic fruits, crisp salad greens, heirloom carrots, and organic Greek yogurt near date.',
        category: 'groceries',
        photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80',
        originalPrice: 22.0,
        price: 6.5,
        discount: '70% OFF',
        bagsAvailable: 4,
        bagsSold: 6,
        status: 'ACTIVE',
        pickupDate: 'Today',
        pickupStart: '7:00 PM',
        pickupEnd: '8:30 PM',
        dietaryTags: ['Organic', 'Vegetarian'],
        co2SavedKg: 2.4,
      },
      {
        id: 'lst-tokyo-bento',
        storeId: tokyoKitchen.id,
        storeName: tokyoKitchen.name,
        title: "Chef's Surplus Bento & Hot Delights",
        description: 'Hearty evening bento with teriyaki glazed tofu, fresh steamed sushi rice, seasonal tsukemono pickles, and gyoza.',
        category: 'meals',
        photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
        originalPrice: 18.0,
        price: 5.99,
        discount: '67% OFF',
        bagsAvailable: 3,
        bagsSold: 5,
        status: 'ACTIVE',
        pickupDate: 'Today',
        pickupStart: '8:00 PM',
        pickupEnd: '9:00 PM',
        dietaryTags: ['Pescatarian'],
        co2SavedKg: 1.5,
      },
    ],
    skipDuplicates: true,
  });

  // 4. Create Sample Active Order for Verification Testing
  await prisma.order.upsert({
    where: { orderNumber: '#FS-84920' },
    update: {},
    create: {
      orderNumber: '#FS-84920',
      pickupCode: 'SAVER-789',
      qrCodeData: 'FOODLINK_ORDER_FS-84920_SAVER-789',
      quantity: 1,
      totalPrice: 4.99,
      status: 'PENDING',
      pickupDate: 'Today',
      pickupStart: '6:30 PM',
      pickupEnd: '7:30 PM',
      co2SavedKg: 1.8,
      moneySaved: 11.01,
      userId: customerUser.id,
      storeId: bakeryStore.id,
      listingId: 'lst-bakery-pastry',
    },
  });

  console.log('✅ FoodLink seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
