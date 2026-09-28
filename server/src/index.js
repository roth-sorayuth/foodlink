import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import prisma from './lib/prisma.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_ORIGIN_CUSTOMER || 'http://localhost:5173',
  process.env.CLIENT_ORIGIN_MERCHANT || 'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:5174',
];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local development
    },
    credentials: true,
  })
);

app.use(express.json());

// Setup Socket.io with open CORS for cross-tab communication
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// Make io accessible in controllers
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Ping / pong for heartbeats
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: Date.now() });
  });

  // Re-broadcast merchant live listing drops to all connected customer clients
  socket.on('NEW_LISTING_DROPPED', async (data) => {
    console.log(`[Socket.io] Merchant broadcasted NEW_LISTING_DROPPED: "${data?.listing?.title || 'New Item'}"`);
    io.emit('NEW_LISTING', data);
    const notif = data?.notification;
    if (notif) {
      io.emit('NEW_NOTIFICATION', notif);
      io.emit('NOTIFICATION_RECEIVED', notif);

      // Defensively ensure notification is saved in DB
      try {
        const listingId = notif.listingId || data?.listing?.id;
        const isRestock = Boolean(data?.isRestocked || notif?.title?.includes('Restock') || notif?.message?.includes('restocked'));
        if (listingId) {
          const existing = await prisma.notification.findFirst({
            where: {
              OR: [
                { listingId },
                ...(notif.id ? [{ id: notif.id }] : []),
              ],
              type: 'NEW_LISTING',
            },
            orderBy: { createdAt: 'desc' },
          });

          const notifTitle = notif.title || (isRestock ? 'Surplus Food Restocked! 🔥' : 'New Surplus Food Available!');
          const notifMessage = notif.message || (isRestock
            ? `${data?.listing?.storeName || 'CAD Bakery'} just restocked "${data?.listing?.title}"!`
            : `${data?.listing?.storeName || 'CAD Bakery'} just listed "${data?.listing?.title}"`);

          if (existing) {
            await prisma.notification.update({
              where: { id: existing.id },
              data: {
                title: notifTitle,
                message: notifMessage,
                isRead: false,
                createdAt: new Date(),
              },
            });
            console.log(`[Socket.io] Updated existing single notification card for listing ${listingId}`);
          } else {
            await prisma.notification.create({
              data: {
                id: notif.id || `notif-${listingId}`,
                type: 'NEW_LISTING',
                title: notifTitle,
                message: notifMessage,
                listingId,
                isRead: false,
              },
            });
            console.log(`[Socket.io] Saved ${isRestock ? 'RESTOCK' : 'NEW_LISTING'} notification to DB for listing ${listingId}`);
          }
        }
      } catch (err) {
        console.warn('Socket NEW_LISTING_DROPPED DB persist notice:', err.message);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FoodLink Backend API & Realtime Gateway',
    timestamp: new Date().toISOString(),
    clientsConnected: io.engine.clientsCount,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 FoodLink Backend & Realtime Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket Gateway ready on ws://localhost:${PORT}`);
  console.log(`✨ Available Endpoints:`);
  console.log(`   - Listings:      GET, POST /api/listings`);
  console.log(`   - Orders:        GET, POST /api/orders | POST /api/orders/verify`);
  console.log(`   - Stores:        GET, PATCH /api/stores`);
  console.log(`   - Notifications: GET, PATCH /api/notifications`);
  console.log(`   - Analytics:     GET /api/analytics/merchant | GET /api/analytics/profile`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
