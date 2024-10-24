import { Router } from 'express';
import authRoute from './auth';
import productRoute from './product';
import orderRoute from './order';
import uploadRoute from './upload';
import { NotFoundError } from '../errors';

const router = Router();

router.use('/auth', authRoute);
router.use('/product', productRoute);
router.use('/order', orderRoute);
router.use('/upload', uploadRoute);

router.use('*', (_req, _res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

export default router;
