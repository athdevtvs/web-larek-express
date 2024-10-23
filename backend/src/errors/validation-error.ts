import mongoose from 'mongoose';
import { NextFunction } from 'express';
import BadRequestError from './bad-request-error';

const ValidationError = (error: mongoose.Error.ValidationError, next: NextFunction) => {
  const messages = Object.values(error.errors).map(err => err.message);
  return next(new BadRequestError(`Проверка не пройдена: ${messages.join(', ')}`));
};

export default ValidationError;
