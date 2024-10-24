import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRequest } from '../types/user';
import { UnauthorizedError } from '../errors';
import ErrorMessage from '../constants/errorMessage';
import { AUTH_JWT_SECRET_KEY } from '../config';

const authMiddleware = (req: UserRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(ErrorMessage.AUTHORIZATION_REQUIRED));
  }

  const token = authorization.replace('Bearer ', '');
  let payload: JwtPayload & { _id: string };

  try {
    payload = jwt.verify(token, AUTH_JWT_SECRET_KEY) as JwtPayload & { _id: string };
  } catch (error) {
    return next(new UnauthorizedError(ErrorMessage.AUTHORIZATION_REQUIRED));
  }

  req.user = payload;
  return next();
};

export default authMiddleware;
