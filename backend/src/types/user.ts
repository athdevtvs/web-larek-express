import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/user';
import { IProduct } from '../models/product';

export interface UserRequest
  extends Request<{ userId: string }, unknown, IUser, unknown> {
  user?: JwtPayload & { _id: string };
}

export interface CardRequest
  extends Request<{ cardId: string }, unknown, IProduct, unknown> {
  user?: JwtPayload & { _id: string };
}
