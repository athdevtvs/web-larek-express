import { Router } from 'express';
import productRoute from './product';
import orderRoute from './order';

const router = Router();

router.use('/product', productRoute);
router.use('/order', orderRoute);

export default router;
