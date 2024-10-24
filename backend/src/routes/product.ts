import { Router } from 'express';
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from '../controllers/products';
import {
  validateProduct,
  validateObjectId,
  validateUpdateProductBody,
} from '../middlewares/validators';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.post('/', authMiddleware, validateProduct, createProduct);
router.delete('/:productId', authMiddleware, validateObjectId, deleteProduct);
router.patch(
  '/:productId',
  authMiddleware,
  validateObjectId,
  validateUpdateProductBody,
  updateProduct
);

export default router;
