import { Router } from 'express';
import {
  login,
  register,
  getCurrentUser,
  logout,
  refreshAccessToken,
} from '../controllers/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/token', refreshAccessToken);
router.get('/logout', logout);
router.get('/user', getCurrentUser);

export default router;
