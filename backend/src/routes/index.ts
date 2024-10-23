import { Router } from 'express';
import authRoute from './auth';
import productRoute from './product';
import orderRoute from './order';

const router = Router();

router.use('/auth', authRoute);
router.use('/product', productRoute);
router.use('/order', orderRoute);

export default router;
