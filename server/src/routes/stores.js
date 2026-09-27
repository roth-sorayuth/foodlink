import { Router } from 'express';
import { getStores, getStoreById, updateStore } from '../controllers/storesController.js';

const router = Router();

router.get('/', getStores);
router.get('/:id', getStoreById);
router.patch('/:id', updateStore);

export default router;
