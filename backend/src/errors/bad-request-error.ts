import { Error } from 'mongoose';
import HttpStatus from '../constants/httpStatus';

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
}

export default BadRequestError;
