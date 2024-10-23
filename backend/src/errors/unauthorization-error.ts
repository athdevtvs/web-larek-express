import { Error } from 'mongoose';
import HttpStatus from '../constants/httpStatus';

class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
