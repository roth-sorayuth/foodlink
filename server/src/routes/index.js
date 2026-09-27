import { Router } from 'express';
import listingsRoutes from './listings.js';
import ordersRoutes from './orders.js';
import storesRoutes from './stores.js';
import notificationsRoutes from './notifications.js';
import analyticsRoutes from './analytics.js';

const router = Router();

router.use('/listings', listingsRoutes);
router.use('/orders', ordersRoutes);
router.use('/stores', storesRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
