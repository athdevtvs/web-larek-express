import { Error } from 'mongoose';
import HttpStatus from '../constants/httpStatus';

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}

export default NotFoundError;
