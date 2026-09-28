import { Router } from 'express';
import { getOrders, createOrder, verifyPickup, lookupOrder } from '../controllers/ordersController.js';

const router = Router();

router.get('/lookup', lookupOrder);
router.get('/', getOrders);
router.post('/', createOrder);
router.post('/verify', verifyPickup);

export default router;
