import { Router } from 'express';
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from '../controllers/products';
import { validateProduct } from '../middlewares/validators';

const router = Router();
router.get('/', getProducts);
router.post('/', validateProduct, createProduct);
router.delete('/:productId', deleteProduct);
router.patch('/:productId', updateProduct);

export default router;
