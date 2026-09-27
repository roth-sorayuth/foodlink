import { Router } from 'express';
import { getMerchantStats, getCustomerProfile } from '../controllers/analyticsController.js';

const router = Router();

router.get('/merchant', getMerchantStats);
router.get('/profile', getCustomerProfile);

export default router;
