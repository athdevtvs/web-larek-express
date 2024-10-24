import { NextFunction } from 'express';
import { MongoError } from '../types/error';
import ConflictError from './conflict-error';

const DuplicateKeyError = (error: MongoError, next: NextFunction) => {
  if (error.keyValue) {
    const duplicateField = Object.keys(error.keyValue).join(', ');
    return next(
      new ConflictError(
        `Товар с ${duplicateField} ${error.keyValue[duplicateField]} уже существует`
      )
    );
  }
  return undefined;
};

export default DuplicateKeyError;
