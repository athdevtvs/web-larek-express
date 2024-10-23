import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/products';
import { validateProduct } from '../middlewares/validators';

const router = Router();
router.get('/', getProducts);
router.post('/', validateProduct, createProduct);

export default router;
