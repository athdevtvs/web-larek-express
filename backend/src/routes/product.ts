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

const router = Router();
router.get('/', getProducts);
router.post('/', validateProduct, createProduct);
router.delete('/:productId', validateObjectId, deleteProduct);
router.patch('/:productId', validateObjectId, validateUpdateProductBody, updateProduct);

export default router;
