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
