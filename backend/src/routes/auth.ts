import { Router } from 'express';
import {
  login,
  register,
  getCurrentUser,
  logout,
  refreshAccessToken,
} from '../controllers/auth';
import {
  validateLoginBody,
  validateRegisterBody,
  validateCurrentUserHeaders,
  validateTokens,
} from '../middlewares/validators';

const router = Router();

router.post('/login', validateLoginBody, login);
router.post('/register', validateRegisterBody, register);
router.get('/token', validateTokens, refreshAccessToken);
router.get('/logout', validateTokens, logout);
router.get('/user', validateCurrentUserHeaders, getCurrentUser);

export default router;
